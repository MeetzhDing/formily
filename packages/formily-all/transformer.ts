import createTransformer from 'ts-import-plugin'

const transformer = createTransformer({
  libraryName: 'all',
  libraryDirectory: 'all',
  camel2DashComponentName: true,
  style: false,
})

export default function () {
  return transformer
}
