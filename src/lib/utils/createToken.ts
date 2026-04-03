import jwt, { type JwtPayload } from "jsonwebtoken";
interface ICreateToken<TPayload extends JwtPayload> {
  payload: TPayload;
  secret: string;
  exp: number;
}

export async function createToken<TPayload extends JwtPayload>({
  payload,
  exp,
  secret,
}: ICreateToken<TPayload>): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { ...payload },
      secret,
      { algorithm: "HS256", expiresIn: exp },
      (err, token) => {
        if (err || !token) return reject(err);
        resolve(token);
      },
    );
  });
}
