import api from './api';
import { TObject } from '../types/TObject';

/**
 * Updates the position for the specific NPC
 *
 * @param { TObject } data The dat a
 * @returns { any } Response
 */
const updatePosition = async (data: TObject): Promise<any> => {
  const response = await api.get(
    `${process.env.REACT_APP_BASE_URL}/update-file?path=${data.path}&sha=${data.sha}&where=${data.where}`,
    data,
  );
  return response;
};

/**
 *  Gets the file data
 *
 * @param { TObject } file The file path
 * @returns { any } The response
 */
const getFileData = async (file: TObject): Promise<any> => {
  const response = api.get(
    `${process.env.REACT_APP_BASE_URL}/get-file?path=${file.path}`,
  );
  return response;
};

const getDataFromGithubFile = async (url: string): Promise<any> => {
  const response = api.get(url);
  return response;
};

export default {
  updatePosition,
  getFileData,
  getDataFromGithubFile,
};
