/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/SearchScreen` | `/SearchScreen`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/UploadScreen` | `/UploadScreen`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/SearchScreen` | `/SearchScreen`; params?: Router.UnknownOutputParams; } | { pathname: `${'/(tabs)'}/UploadScreen` | `/UploadScreen`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/_sitemap${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/SearchScreen${`?${string}` | `#${string}` | ''}` | `/SearchScreen${`?${string}` | `#${string}` | ''}` | `${'/(tabs)'}/UploadScreen${`?${string}` | `#${string}` | ''}` | `/UploadScreen${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/SearchScreen` | `/SearchScreen`; params?: Router.UnknownInputParams; } | { pathname: `${'/(tabs)'}/UploadScreen` | `/UploadScreen`; params?: Router.UnknownInputParams; };
    }
  }
}
