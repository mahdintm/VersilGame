import sjcl from "sjcl";
import { logger } from "../system/logger";

export class hashing {
  static sjcl = {
    async verify(Data, HashedData) {
      try {
        const [_key, _salt] = await HashedData.split("$");
        const saltBits = sjcl.codec.base64.toBits(_salt);
        const derivedKey = sjcl.misc.pbkdf2(Data, saltBits, 2000, 256);
        const derivedBaseKey = sjcl.codec.base64.fromBits(derivedKey);
        if (_key != derivedBaseKey) return false;
        return true;
      } catch (error) {
        await logger.addlog.server({
          locatin: "Server->Utils->Hash->Class Hashing->sjcl->verify()",
          message: error,
        });
      }
    },
    async ConvertToHash(Data) {
      try {
        const saltBits = sjcl.random.randomWords(2, 0);
        const salt = sjcl.codec.base64.fromBits(saltBits);
        const key = sjcl.codec.base64.fromBits(sjcl.misc.pbkdf2(Data, saltBits, 2000, 256));
        return `${key}$${salt}`;
      } catch (error) {
        await logger.addlog.server({
          locatin: "Server->Utils->Hash->Class Hashing->sjcl->ConvertToHash()",
          message: error,
        });
      }
    },
  };
}
