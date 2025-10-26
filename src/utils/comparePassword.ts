import { compare } from "bcrypt";

const comparePassword = async (
  plainPassword: string,
  encryptedPassword: string,
) => {
  return await compare(plainPassword, encryptedPassword);
};

export default comparePassword;
