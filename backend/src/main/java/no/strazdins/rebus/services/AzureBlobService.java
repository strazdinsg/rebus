package no.strazdins.rebus.services;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobClientBuilder;
import com.azure.storage.blob.models.BlobHttpHeaders;
import com.azure.storage.blob.models.BlobStorageException;
import java.io.IOException;
import java.util.UUID;
import java.util.logging.Logger;
import no.strazdins.rebus.controllers.InternalServerErrorException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service for Azure Blob Storage.
 */
@Service
public class AzureBlobService {
  @Value("${azure.storage.connection-string}")
  private String connectionString;

  @Value("${azure.storage.container-name}")
  private String containerName;

  @Value("${azure.storage.account-name}")
  private String accountName;

  private final Logger logger = Logger.getLogger(this.getClass().getSimpleName());

  /**
   * Upload an image to Azure Blob Storage.
   *
   * @param file The image file to upload
   * @return The URL of the uploaded image
   */
  public String uploadImage(MultipartFile file)
      throws BlobStorageException, InternalServerErrorException {
    String fileName = generateUniqueRandomFilename();

    try {
      BlobClient blobClient = createBlobClientFor(fileName);
      uploadImageContent(file, blobClient);
      return getPublicImageUrl(fileName);
    } catch (Exception e) {
      logger.severe("Azure Blob storage: %s".formatted(e.getMessage()));
      throw new InternalServerErrorException("Azure Blob storage error, contact the administrator");
    }
  }

  private static String generateUniqueRandomFilename() {
    return UUID.randomUUID() + ".jpg";
  }

  private BlobClient createBlobClientFor(String fileName) {
    return new BlobClientBuilder()
        .connectionString(connectionString)
        .containerName(containerName)
        .blobName(fileName)
        .buildClient();
  }

  private static void uploadImageContent(MultipartFile file, BlobClient blobClient)
      throws IOException {
    blobClient.upload(file.getInputStream(), file.getSize(), true);
    blobClient.setHttpHeaders(new BlobHttpHeaders().setContentType("image/jpeg"));
  }

  private String getPublicImageUrl(String fileName) {
    return String.format("https://%s.blob.core.windows.net/%s/%s",
        accountName, containerName, fileName);
  }
}
