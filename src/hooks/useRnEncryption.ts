import { NativeModules } from "react-native";

export default () => {
  const ENCRYPTED_KEY =
    "cece3a7dc9cf86aae926fd2ee520a06e5a5b616fa9e381de53600121e8aff095";
  const IV = "0d80ceb86d2a390c0c189e26a6264974";

  const myEncrypt = async (cardDetail: string): Promise<string> => {
    // let Key = await NativeModules.Aes.pbkdf2("Arnold", "salt", 5000, 256);
    // console.log("key : " + JSON.stringify(Key));

    // let randomKey = await NativeModules.Aes.randomKey(16);
    // console.log("iv : " + JSON.stringify(randomKey));

    return NativeModules.Aes.encrypt(
      cardDetail,
      ENCRYPTED_KEY,
      IV,
      "aes-256-cbc"
    );
  };

  const decrypt = (encryptedData: any): Promise<string> => {
    return NativeModules.Aes.decrypt(
      encryptedData,
      ENCRYPTED_KEY,
      IV,
      "aes-256-cbc"
    );
  };

  return { encrypt: myEncrypt, decrypt };
};
