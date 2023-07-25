export type SimpleMerge<Destination, Source> = {
  [Key in keyof Destination as Key extends keyof Source ? never : Key]: Destination[Key];
} & Source;
