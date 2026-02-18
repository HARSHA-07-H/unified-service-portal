package com.example.demo.service;

import com.example.demo.model.Admin;
import com.example.demo.model.User;
import com.example.demo.repository.AdminRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ ADD USER WITH RANK & AREA
    public User addUserToAdmin(
            String adminId,
            String username,
            String password,
            String rank,
            String areaOfWorking
    ) {
        Admin admin = adminRepository.findByAdminId(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRank(rank);
        user.setAreaOfWorking(areaOfWorking);
        user.setAdmin(admin);

        return userRepository.save(user);
    }

    // ✅ DELETE USER
    public void deleteUserFromAdmin(String adminId, String username) {
        Admin admin = adminRepository.findByAdminId(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        User user = userRepository.findByAdminAndUsername(admin, username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);
    }

    // ✅ EDIT USERNAME
    public void editUserOfAdmin(String adminId, String username, String newUsername) {
        Admin admin = adminRepository.findByAdminId(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        User user = userRepository.findByAdminAndUsername(admin, username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(newUsername);
        userRepository.save(user);
    }

    // ✅ EDIT RANK & AREA OF WORKING (THIS IS WHAT YOU WANTED)
    public void updateUserRankAndArea(
            String adminId,
            String username,
            String rank,
            String areaOfWorking
    ) {
        Admin admin = adminRepository.findByAdminId(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        User user = userRepository.findByAdminAndUsername(admin, username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRank(rank);
        user.setAreaOfWorking(areaOfWorking);

        userRepository.save(user);
    }

    // ✅ PAGINATION
    public Page<User> getUsersByAdminPaginated(String adminId, int page, int size) {
        Admin admin = adminRepository.findByAdminId(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findByAdmin(admin, pageable);
    }
}
