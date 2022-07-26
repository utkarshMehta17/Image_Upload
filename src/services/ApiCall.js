import request from './Service';

const requestUploadImage = async (params) => {
  return await request({
      url: 'ImageUpload',
      method: "post",
      params
  });
};

export {
  requestUploadImage
}