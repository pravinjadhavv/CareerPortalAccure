package com.careerportal.service;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {
  private final Path root;

  public FileStorageService(@Value("${app.upload.dir:uploads}") String uploadDir) {
    this.root = Paths.get(uploadDir).toAbsolutePath().normalize();
  }

  public String save(MultipartFile file, String prefix) {
    if (file == null || file.isEmpty()) return null;
    try {
      Files.createDirectories(root);
      String safeName =
          (prefix == null ? "" : prefix + "_")
              + UUID.randomUUID()
              + "_"
              + (file.getOriginalFilename() == null ? "file" : file.getOriginalFilename());
      safeName = safeName.replaceAll("[^a-zA-Z0-9._-]", "_");
      Path target = root.resolve(safeName);
      Files.copy(file.getInputStream(), target);
      return target.toString();
    } catch (IOException e) {
      throw new IllegalArgumentException("Failed to save file");
    }
  }

  public Resource load(String storedPath) {
    if (storedPath == null || storedPath.isBlank()) {
      throw new IllegalArgumentException("File not found");
    }
    try {
      Path path = Paths.get(storedPath);
      if (!path.isAbsolute()) {
        path = root.resolve(path).normalize();
      }
      Resource resource = new UrlResource(path.toUri());
      if (!resource.exists() || !resource.isReadable()) {
        throw new IllegalArgumentException("File not found");
      }
      return resource;
    } catch (MalformedURLException e) {
      throw new IllegalArgumentException("File not found");
    }
  }
}

