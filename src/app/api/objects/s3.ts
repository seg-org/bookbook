import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { z } from "zod";

const awsEnvSchema = z.object({
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_BUCKET_NAME: z.string(),
});

const awsEnv = awsEnvSchema.parse(process.env);

const s3 = new S3Client({
  endpoint: undefined,
  region: awsEnv.AWS_REGION,
  credentials: {
    accessKeyId: awsEnv.AWS_ACCESS_KEY_ID,
    secretAccessKey: awsEnv.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadToBucket = async (folder: string, file: File) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadParams = {
      Bucket: awsEnv.AWS_BUCKET_NAME,
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
  // TODO Handle custom endpoint
  return `https://${awsEnv.AWS_BUCKET_NAME}.s3.${awsEnv.AWS_REGION}.amazonaws.com/${folder}/${key}`;
};

export const deleteObject = async (folder: string, key: string): Promise<boolean> => {
  try {
    const params = {
      Bucket: awsEnv.AWS_BUCKET_NAME,
      Key: `${folder}/${key}`,
    };

    await s3.send(new DeleteObjectCommand(params));
    return true;
  } catch (error) {
    console.error("Error deleting object from S3:", error);
    return false;
  }
};
