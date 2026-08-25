package com.ciu.sys.admin;

import java.nio.file.*;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.ciu.sys.student.StudentAccount;
import com.ciu.sys.student.StudentRepository;

@RestController
@RequestMapping("/api/admin/students")
public class AdminCardController {

  @Autowired
  private StudentRepository studentRepository;

  private final Path photoDir = Paths.get("uploads/photos");

  @PutMapping("/{id}/card")
  public ResponseEntity<?> updateCard(@PathVariable Long id, @RequestBody Map<String, String> body) {
    Optional<StudentAccount> found = studentRepository.findById(id);
    if (found.isEmpty())
      return ResponseEntity.status(404).body(Map.of("message", "Student not found"));
    StudentAccount s = found.get();

    String fullName = body.getOrDefault("fullName", "").trim();
    if (!fullName.isEmpty())
      s.setUsername(fullName);

    String major = body.getOrDefault("major", "").trim();
    if (!major.isEmpty())
      s.setMajor(major);

    String phone = body.getOrDefault("phone", "").trim();
    if (!phone.isEmpty())
      s.setPhone(phone);

    String address = body.getOrDefault("address", "").trim();
    if (!address.isEmpty())
      s.setAddress(address);

    String code = body.getOrDefault("cardCode", "").trim();
    if (!code.isEmpty()) {
      var dup = studentRepository.findByCardCode(code);
      if (dup.isPresent() && !dup.get().getId().equals(id))
        return ResponseEntity.status(409).body(Map.of("message", "Card code already used by another student"));
      s.setCardCode(code);
    }

    studentRepository.save(s);
    return ResponseEntity.ok(Map.of(
        "id", s.getId(),
        "username", nz(s.getUsername()),
        "major", nz(s.getMajor()),
        "phone", nz(s.getPhone()),
        "address", nz(s.getAddress()),
        "cardCode", s.getCardCode() == null ? String.format("%06d", s.getId()) : s.getCardCode(),
        "photoUrl", nz(s.getPhotoUrl())));
  }

  @PostMapping("/{id}/photo")
  public ResponseEntity<?> uploadPhoto(@PathVariable Long id, @RequestParam("file") MultipartFile file)
      throws Exception {
    Optional<StudentAccount> found = studentRepository.findById(id);
    if (found.isEmpty())
      return ResponseEntity.status(404).body(Map.of("message", "Student not found"));

    Files.createDirectories(photoDir);
    String original = file.getOriginalFilename();
    String ext = original != null && original.contains(".") ? original.substring(original.lastIndexOf('.')) : ".jpg";
    String name = UUID.randomUUID() + ext;
    Files.copy(file.getInputStream(), photoDir.resolve(name), StandardCopyOption.REPLACE_EXISTING);
    String url = "/photos/" + name;

    StudentAccount s = found.get();
    s.setPhotoUrl(url);
    studentRepository.save(s);
    return ResponseEntity.ok(Map.of("photoUrl", url));
  }

  private String nz(String v) {
    return v == null ? "" : v;
  }
}
