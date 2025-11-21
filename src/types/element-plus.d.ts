import 'vue'

declare module 'vue' {
  // Element Plus references an internal helper that was removed from
  // the public typings. Re-export it for compatibility.
  export type __ExtractPublicPropTypes<T> = ExtractPublicPropTypes<T>
}

declare module 'csstype' {
  // Older versions of `csstype` don't expose `ZIndexProperty`.
  // Define it here so Element Plus typings compile.
  type ZIndexProperty = number | string
}

