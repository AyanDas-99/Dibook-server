const cloudinary = require('cloudinary').v2;
const uuid = require('uuid').v4;
const fs = require('fs');

class cloudinaryUtils {
    static async uploadFileToCloudinary(doc) {
        try {

            // Write PDFDocument to a temporary file:
            const tempFilePath = await new Promise((resolve, reject) => {
                const tempFile = fs.createWriteStream('/tmp/temporary-pdf.pdf');
                doc.pipe(tempFile).on('finish', () => resolve(tempFile.path));
            });

            // Upload using upload method:
            const uploadResult = await cloudinary.uploader.upload(tempFilePath, { resource_type: 'raw', public_id: `Dibook/Receipts/${uuid()}` });

            // Access the uploaded file URL:
            const uploadedFileUrl = uploadResult.secure_url;
            console.log("Uploaded file URL:", uploadedFileUrl);

            // Delete the temporary file:
            fs.unlinkSync(tempFilePath);

            return uploadedFileUrl;
        } catch (e) {
            console.error(e)
        }
    }

    static async deleteFileFromCloudinary(publicIds) {
        try {
            const deleteResult = await cloudinary.api.delete_resources(publicIds);
            const deleteFolderResult = await cloudinary.api.delete_folder(this.getFolderNameFromPublicId(publicIds[0]));
            return [deleteResult, deleteFolderResult];
        } catch (e) {
            console.error(e);
        }
    }

    static getCloudinaryPublicId(url) {
        // Split the URL by '/'
        const parts = url.split('/');
        var indexOfUpload = parts.findIndex((e) => e == 'upload');
        // The public ID is everything after the domain and 'upload/' part
        const publicId = parts.slice(indexOfUpload+2).join('/').split('.')[0].replaceAll("%20", " ");
        return publicId;
    }
    
    static getFolderNameFromPublicId(publicId) {
        const parts = publicId.split('/');
        parts.splice(-1);
        const folder = parts.join('/').replaceAll("%20", " ");
        return folder;
    }

}

module.exports = cloudinaryUtils;