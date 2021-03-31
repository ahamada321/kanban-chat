import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ImageUploadQrCodeComponent } from "./image-upload-qr-code.component";
// import { ImageUploadService } from './image-upload.service';
import { ImageCropperModule } from "ngx-image-cropper";
import { ImageUploadService } from "../image-upload/service/image-upload.service";

@NgModule({
  declarations: [ImageUploadQrCodeComponent],
  imports: [CommonModule, ImageCropperModule],
  exports: [ImageUploadQrCodeComponent],
  providers: [ImageUploadService],
})
export class ImageUploadQrCodeModule {}
