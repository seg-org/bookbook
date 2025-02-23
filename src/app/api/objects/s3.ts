import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const s3 = new S3Client({
  endpoint: process.env.AWS_ENDPOINT,
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
  forcePathStyle: !!process.env.AWS_ENDPOINT,
});

export const uploadToBucket = async (folder: string, file: File) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${folder}/${Date.now()}-${file.name}`,
      Body: buffer,
      ContentType: file.type,
    };

    const upload = new Upload({
      client: s3,
      params: uploadParams,
    });

    const data = await upload.done();

    return data;
  } catch (error) {
    console.error("Error uploading file", error);
    throw new Error("Cannot upload file");
  }
};

export const getUrl = (folder: string, key: string) => {
  // const signedUrl = s3.getSignedUrl("getObject", {
  //   Bucket: process.env.AWS_BUCKET_NAME!,
  //   Key: `${folder}/${key}`,
  //   Expires: 3600,
  // });

  // return signedUrl;
  const endpointUrl = process.env.AWS_ENDPOINT
    ? `${process.env.AWS_ENDPOINT}/${process.env.AWS_BUCKET_NAME}`
    : `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;

  return `${endpointUrl}/${folder}/${key}`;
};

export const deleteObject = async (folder: string, key: string): Promise<boolean> => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${folder}/${key}`,
    };

    await s3.send(new DeleteObjectCommand(params));
    return true;
  } catch (error) {
    console.error("Error deleting object from S3:", error);
    return false;
  }
};
