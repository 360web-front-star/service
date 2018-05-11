import { EggAppConfig, PowerPartial } from "egg";

// for config.{env}.ts
export type DefaultConfig = PowerPartial<EggAppConfig & BizConfig>;

// app special config scheme
export interface BizConfig {
  sourceUrl: string;
}

export default (appInfo: EggAppConfig) => {
  const config = {} as PowerPartial<EggAppConfig> & BizConfig;

  // app special config
  config.sourceUrl = `https://github.com/eggjs/examples/tree/master/${
    appInfo.name
  }`;

  config.security = {
    csrf: {
      enable: false
    }
  };
  config.baseUrl = "localhost:7001";

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1525947350515_3540";

  // add your config here
  config.middleware = [];

  config.cors = {
    origin: "*",
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH"
  };
  
  config.view = {
    mapping: {
      ".ejs": "ejs"
    }
  };

  return config;
};
