package com.example.demo.controller;

import com.example.demo.model.Admin;
import com.example.demo.service.AdminService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    @Autowired
    private AdminService adminService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // Validate input
        ValidationResult validation = validateLoginRequest(request);
        if (!validation.isValid()) {
            return ResponseEntity.badRequest().body(
                new LoginResponse("error", null, null, null, false, validation.getErrorMessage())
            );
        }

        // DEVELOPMENT MODE: Simple hardcoded login for testing
        if ("prerana".equals(request.getUsername()) && "Prerana@542004".equals(request.getPassword())) {
            return ResponseEntity.ok(
                new LoginResponse(
                    "success", 
                    "token_admin_" + System.currentTimeMillis(), 
                    "SUPER_ADMIN", 
                    "1",
                    false,
                    "Login successful"
                )
            );
        }

        // Check if admin exists in database (for production) using name
        Optional<Admin> adminOpt = adminService.findByName(request.getUsername());
        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new LoginResponse("error", null, null, null, false, "Invalid username or password")
            );
        }

        Admin admin = adminOpt.get();

        // Verify password
        if (!adminService.verifyPassword(request.getPassword(), admin.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new LoginResponse("error", null, null, null, false, "Invalid username or password")
            );
        }

        // Check if admin is active
        if (!admin.getIsActive()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new LoginResponse("error", null, null, null, false, "Admin account is inactive")
            );
        }

        // Check if first login (needs password change)
        boolean needsPasswordChange = admin.getFirstLogin();

        return ResponseEntity.ok(
            new LoginResponse(
                "success", 
                "token_" + admin.getAdminId() + "_" + System.currentTimeMillis(), 
                "ADMIN", 
                admin.getAdminId().toString(),
                needsPasswordChange,
                "Login successful"
            )
        );
    }
    
    @PostMapping("/upload-admins")
    public ResponseEntity<?> uploadAdmins(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(
                Collections.singletonMap("error", "No file provided")
            );
        }

        try {
            List<Map<String, String>> results = adminService.importAdminsFromExcel(file);
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Excel file processed successfully");
            response.put("results", results);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Collections.singletonMap("error", "Error processing file: " + e.getMessage())
            );
        }
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest request) {
        if (request.getAdminId() == null || request.getAdminId().isEmpty()) {
            return ResponseEntity.badRequest().body(
                Collections.singletonMap("error", "Admin ID is required")
            );
        }

        Map<String, Object> response = adminService.changePassword(
            request.getAdminId(),
            request.getOldPassword(),
            request.getNewPassword()
        );

        if ("error".equals(response.get("status"))) {
            return ResponseEntity.badRequest().body(response);
        }

        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/force-change-password")
    public ResponseEntity<?> forceChangePassword(@RequestBody ForcePasswordChangeRequest request) {
        if (request.getAdminId() == null || request.getAdminId().isEmpty()) {
            return ResponseEntity.badRequest().body(
                Collections.singletonMap("error", "Admin ID is required")
            );
        }

        Map<String, Object> response = adminService.forcePasswordChange(
            request.getAdminId(),
            request.getNewPassword()
        );

        if ("error".equals(response.get("status"))) {
            return ResponseEntity.badRequest().body(response);
        }

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/health")
    public String health() {
        return "Backend is running!";
    }

    
    // Validation method
    private ValidationResult validateLoginRequest(LoginRequest request) {
        if (request == null) {
            return new ValidationResult(false, "Request body cannot be null");
        }

        String username = request.getUsername();
        String password = request.getPassword();

        // Username validation
        if (username == null || username.trim().isEmpty()) {
            return new ValidationResult(false, "Username is required");
        }

        if (username.length() < 3) {
            return new ValidationResult(false, "Username must be at least 3 characters");
        }

        if (username.length() > 50) {
            return new ValidationResult(false, "Username cannot exceed 50 characters");
        }

        // Password validation
        if (password == null || password.isEmpty()) {
            return new ValidationResult(false, "Password is required");
        }

        if (password.length() < 6) {
            return new ValidationResult(false, "Password must be at least 6 characters");
        }

        if (password.length() > 100) {
            return new ValidationResult(false, "Password cannot exceed 100 characters");
        }

        return new ValidationResult(true, "");
    }
}

class LoginRequest {
    private String username;
    private String password;
    
    public LoginRequest() {}
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}

class LoginResponse {
    private String status;
    private String token;
    private String role;
    private String adminId;
    private Boolean needsPasswordChange;
    private String message;
    
    public LoginResponse(String status, String token, String role, String adminId, Boolean needsPasswordChange, String message) {
        this.status = status;
        this.token = token;
        this.role = role;
        this.adminId = adminId;
        this.needsPasswordChange = needsPasswordChange;
        this.message = message;
    }

    public LoginResponse(String status, String token, String role, String message) {
        this.status = status;
        this.token = token;
        this.role = role;
        this.message = message;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }

    public String getAdminId() {
        return adminId;
    }

    public void setAdminId(String adminId) {
        this.adminId = adminId;
    }

    public Boolean getNeedsPasswordChange() {
        return needsPasswordChange;
    }

    public void setNeedsPasswordChange(Boolean needsPasswordChange) {
        this.needsPasswordChange = needsPasswordChange;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

class PasswordChangeRequest {
    private String adminId;
    private String oldPassword;
    private String newPassword;

    public PasswordChangeRequest() {}

    public String getAdminId() {
        return adminId;
    }

    public void setAdminId(String adminId) {
        this.adminId = adminId;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}

class ForcePasswordChangeRequest {
    private String adminId;
    private String newPassword;

    public ForcePasswordChangeRequest() {}

    public String getAdminId() {
        return adminId;
    }

    public void setAdminId(String adminId) {
        this.adminId = adminId;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}

// Validation result helper class
class ValidationResult {
    private boolean valid;
    private String errorMessage;

    public ValidationResult(boolean valid, String errorMessage) {
        this.valid = valid;
        this.errorMessage = errorMessage;
    }

    public boolean isValid() {
        return valid;
    }

    public String getErrorMessage() {
        return errorMessage;
    }
}
