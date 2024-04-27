export type EnvVariablesMap = {
  JWT_SECRET: string;
  PORT: number;
  NODE_ENV: 'production' | 'development';
  MONGO_URL: string;
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
};

export type EnvVariablesKey = keyof EnvVariablesMap;

export type VariableMapper<Result> = (value: string) => Result;

export type TypeMappers = {
  [Key in keyof EnvVariablesMap]: VariableMapper<EnvVariablesMap[Key]>;
};
