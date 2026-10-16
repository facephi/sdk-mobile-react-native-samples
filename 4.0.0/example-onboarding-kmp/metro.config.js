const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const projectRoot = __dirname;
const sdkRoot = path.resolve(projectRoot, '../4.0.0');

const facephiPackages = {
  '@facephi/sdk-core-react-native': path.join(sdkRoot, 'sdk-core'),
  '@facephi/sdk-selphi-react-native': path.join(sdkRoot, 'sdk-selphi'),
  '@facephi/sdk-selphid-react-native': path.join(sdkRoot, 'sdk-selphid'),
};

/**
 * Los SDK están enlazados fuera de este proyecto (file:../4.0.0/...).
 * Metro solo indexa la raíz del proyecto, así que el destino del symlink
 * no existe para el resolver hasta que se añade a watchFolders.
 */
const config = {
  watchFolders: Object.values(facephiPackages),
  resolver: {
    nodeModulesPaths: [path.resolve(projectRoot, 'node_modules')],
    extraNodeModules: facephiPackages,
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
