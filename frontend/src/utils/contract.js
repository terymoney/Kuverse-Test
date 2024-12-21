import { ethers } from 'ethers';
import contractABI from './contractABI';

const contractAddress = '0xEC0bf53E0698FC5303dffccb54A950225b1fC8BA'; // Contract address

export const getContract = (library) => {
  const signer = library.getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};
