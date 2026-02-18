package com.example.demo.service;

import com.example.demo.model.Admin;
import com.example.demo.repository.AdminRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class AdminService {
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    private static final String DEFAULT_PASSWORD = "Admin@123456";
    
    public List<Map<String, String>> importAdminsFromExcel(MultipartFile file) throws IOException {
        List<Map<String, String>> results = new ArrayList<>();
        
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            
            // Skip header row (row 0)
            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                
                Map<String, String> resultMap = new HashMap<>();
                
                try {
                    String adminId = getCellValue(row.getCell(0));
                    String name = getCellValue(row.getCell(1));
                    String rank = getCellValue(row.getCell(2));
                    String areaOfWorking = getCellValue(row.getCell(3));
                    
                    // Validate required fields
                    if (adminId.isEmpty() || name.isEmpty() || rank.isEmpty() || areaOfWorking.isEmpty()) {
                        resultMap.put("status", "error");
                        resultMap.put("adminId", adminId);
                        resultMap.put("message", "Missing required fields");
                        results.add(resultMap);
                        continue;
                    }
                    
                    // Check if admin already exists
                    if (adminRepository.findByAdminId(adminId).isPresent()) {
                        resultMap.put("status", "skipped");
                        resultMap.put("adminId", adminId);
                        resultMap.put("message", "Admin already exists");
                        results.add(resultMap);
                        continue;
                    }
                    
                    // Create new admin
                    Admin admin = new Admin();
                    admin.setAdminId(adminId);
                    admin.setName(name);
                    admin.setRank(rank);
                    admin.setAreaOfWorking(areaOfWorking);
                    admin.setPassword(encodePassword(DEFAULT_PASSWORD));
                    admin.setPasswordChanged(false);
                    admin.setFirstLogin(true);
                    admin.setIsActive(true);
                    
                    adminRepository.save(admin);
                    
                    resultMap.put("status", "success");
                    resultMap.put("adminId", adminId);
                    resultMap.put("name", name);
                    resultMap.put("message", "Admin created successfully with default password");
                    
                } catch (Exception e) {
                    resultMap.put("status", "error");
                    resultMap.put("message", "Error processing row: " + e.getMessage());
                }
                
                results.add(resultMap);
            }
        }
        
        return results;
    }
    
    public Map<String, Object> changePassword(String adminId, String oldPassword, String newPassword) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<Admin> adminOpt = adminRepository.findByAdminId(adminId);
        if (adminOpt.isEmpty()) {
            response.put("status", "error");
            response.put("message", "Admin not found");
            return response;
        }
        
        Admin admin = adminOpt.get();
        
        // Verify old password
        if (!matchPassword(oldPassword, admin.getPassword())) {
            response.put("status", "error");
            response.put("message", "Current password is incorrect");
            return response;
        }
        
        // Validate new password
        if (!isValidPassword(newPassword)) {
            response.put("status", "error");
            response.put("message", "New password does not meet requirements (min 8 chars, mixed case, number, special char)");
            return response;
        }
        
        // Update password
        admin.setPassword(encodePassword(newPassword));
        admin.setPasswordChanged(true);
        admin.setFirstLogin(false);
        adminRepository.save(admin);
        
        response.put("status", "success");
        response.put("message", "Password changed successfully");
        return response;
    }
    
    public Map<String, Object> forcePasswordChange(String adminId, String newPassword) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<Admin> adminOpt = adminRepository.findByAdminId(adminId);
        if (adminOpt.isEmpty()) {
            response.put("status", "error");
            response.put("message", "Admin not found");
            return response;
        }
        
        Admin admin = adminOpt.get();
        
        // Validate new password
        if (!isValidPassword(newPassword)) {
            response.put("status", "error");
            response.put("message", "Password does not meet requirements (min 8 chars, mixed case, number, special char)");
            return response;
        }
        
        // Update password
        admin.setPassword(encodePassword(newPassword));
        admin.setPasswordChanged(true);
        admin.setFirstLogin(false);
        adminRepository.save(admin);
        
        response.put("status", "success");
        response.put("message", "Password updated successfully");
        return response;
    }
    
    public boolean hasChangedPassword(String adminId) {
        Optional<Admin> adminOpt = adminRepository.findByAdminId(adminId);
        return adminOpt.map(Admin::getPasswordChanged).orElse(false);
    }
    
    public boolean isFirstLogin(String adminId) {
        Optional<Admin> adminOpt = adminRepository.findByAdminId(adminId);
        return adminOpt.map(Admin::getFirstLogin).orElse(false);
    }
    
    public Optional<Admin> findByAdminId(String adminId) {
        return adminRepository.findByAdminId(adminId);
    }
    
    public Optional<Admin> findByName(String name) {
        return adminRepository.findByName(name);
    }
    
    // Helper methods
    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                return String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }
    
    private String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }
    
    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
    
    private boolean matchPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
    
    private boolean isValidPassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        
        boolean hasUpper = password.matches(".*[A-Z].*");
        boolean hasLower = password.matches(".*[a-z].*");
        boolean hasDigit = password.matches(".*\\d.*");
        boolean hasSpecial = password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*");
        
        return hasUpper && hasLower && hasDigit && hasSpecial;
    }
}
