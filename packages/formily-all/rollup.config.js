import baseConfig, {
  removeImportStyleFromInputFilePlugin,
} from './config/rollup.base.js'

export default baseConfig(
  'formily.all',
  'Formily.all',
  ['vue', 'vue-demi', 'element-ui', 'lodash-es'],
  removeImportStyleFromInputFilePlugin()
)
