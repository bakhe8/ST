
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Theme
 * 
 */
export type Theme = $Result.DefaultSelection<Prisma.$ThemePayload>
/**
 * Model ThemeVersion
 * 
 */
export type ThemeVersion = $Result.DefaultSelection<Prisma.$ThemeVersionPayload>
/**
 * Model Store
 * 
 */
export type Store = $Result.DefaultSelection<Prisma.$StorePayload>
/**
 * Model StoreState
 * 
 */
export type StoreState = $Result.DefaultSelection<Prisma.$StoreStatePayload>
/**
 * Model ComponentState
 * 
 */
export type ComponentState = $Result.DefaultSelection<Prisma.$ComponentStatePayload>
/**
 * Model PageComposition
 * 
 */
export type PageComposition = $Result.DefaultSelection<Prisma.$PageCompositionPayload>
/**
 * Model DataEntity
 * 
 */
export type DataEntity = $Result.DefaultSelection<Prisma.$DataEntityPayload>
/**
 * Model Collection
 * 
 */
export type Collection = $Result.DefaultSelection<Prisma.$CollectionPayload>
/**
 * Model CollectionItem
 * 
 */
export type CollectionItem = $Result.DefaultSelection<Prisma.$CollectionItemPayload>
/**
 * Model DataBinding
 * 
 */
export type DataBinding = $Result.DefaultSelection<Prisma.$DataBindingPayload>
/**
 * Model Snapshot
 * 
 */
export type Snapshot = $Result.DefaultSelection<Prisma.$SnapshotPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Themes
 * const themes = await prisma.theme.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Themes
   * const themes = await prisma.theme.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.theme`: Exposes CRUD operations for the **Theme** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Themes
    * const themes = await prisma.theme.findMany()
    * ```
    */
  get theme(): Prisma.ThemeDelegate<ExtArgs>;

  /**
   * `prisma.themeVersion`: Exposes CRUD operations for the **ThemeVersion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ThemeVersions
    * const themeVersions = await prisma.themeVersion.findMany()
    * ```
    */
  get themeVersion(): Prisma.ThemeVersionDelegate<ExtArgs>;

  /**
   * `prisma.store`: Exposes CRUD operations for the **Store** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Stores
    * const stores = await prisma.store.findMany()
    * ```
    */
  get store(): Prisma.StoreDelegate<ExtArgs>;

  /**
   * `prisma.storeState`: Exposes CRUD operations for the **StoreState** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StoreStates
    * const storeStates = await prisma.storeState.findMany()
    * ```
    */
  get storeState(): Prisma.StoreStateDelegate<ExtArgs>;

  /**
   * `prisma.componentState`: Exposes CRUD operations for the **ComponentState** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ComponentStates
    * const componentStates = await prisma.componentState.findMany()
    * ```
    */
  get componentState(): Prisma.ComponentStateDelegate<ExtArgs>;

  /**
   * `prisma.pageComposition`: Exposes CRUD operations for the **PageComposition** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PageCompositions
    * const pageCompositions = await prisma.pageComposition.findMany()
    * ```
    */
  get pageComposition(): Prisma.PageCompositionDelegate<ExtArgs>;

  /**
   * `prisma.dataEntity`: Exposes CRUD operations for the **DataEntity** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DataEntities
    * const dataEntities = await prisma.dataEntity.findMany()
    * ```
    */
  get dataEntity(): Prisma.DataEntityDelegate<ExtArgs>;

  /**
   * `prisma.collection`: Exposes CRUD operations for the **Collection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Collections
    * const collections = await prisma.collection.findMany()
    * ```
    */
  get collection(): Prisma.CollectionDelegate<ExtArgs>;

  /**
   * `prisma.collectionItem`: Exposes CRUD operations for the **CollectionItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CollectionItems
    * const collectionItems = await prisma.collectionItem.findMany()
    * ```
    */
  get collectionItem(): Prisma.CollectionItemDelegate<ExtArgs>;

  /**
   * `prisma.dataBinding`: Exposes CRUD operations for the **DataBinding** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DataBindings
    * const dataBindings = await prisma.dataBinding.findMany()
    * ```
    */
  get dataBinding(): Prisma.DataBindingDelegate<ExtArgs>;

  /**
   * `prisma.snapshot`: Exposes CRUD operations for the **Snapshot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Snapshots
    * const snapshots = await prisma.snapshot.findMany()
    * ```
    */
  get snapshot(): Prisma.SnapshotDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Theme: 'Theme',
    ThemeVersion: 'ThemeVersion',
    Store: 'Store',
    StoreState: 'StoreState',
    ComponentState: 'ComponentState',
    PageComposition: 'PageComposition',
    DataEntity: 'DataEntity',
    Collection: 'Collection',
    CollectionItem: 'CollectionItem',
    DataBinding: 'DataBinding',
    Snapshot: 'Snapshot'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "theme" | "themeVersion" | "store" | "storeState" | "componentState" | "pageComposition" | "dataEntity" | "collection" | "collectionItem" | "dataBinding" | "snapshot"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Theme: {
        payload: Prisma.$ThemePayload<ExtArgs>
        fields: Prisma.ThemeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ThemeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ThemeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>
          }
          findFirst: {
            args: Prisma.ThemeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ThemeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>
          }
          findMany: {
            args: Prisma.ThemeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>[]
          }
          create: {
            args: Prisma.ThemeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>
          }
          createMany: {
            args: Prisma.ThemeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ThemeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>[]
          }
          delete: {
            args: Prisma.ThemeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>
          }
          update: {
            args: Prisma.ThemeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>
          }
          deleteMany: {
            args: Prisma.ThemeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ThemeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ThemeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemePayload>
          }
          aggregate: {
            args: Prisma.ThemeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTheme>
          }
          groupBy: {
            args: Prisma.ThemeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ThemeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ThemeCountArgs<ExtArgs>
            result: $Utils.Optional<ThemeCountAggregateOutputType> | number
          }
        }
      }
      ThemeVersion: {
        payload: Prisma.$ThemeVersionPayload<ExtArgs>
        fields: Prisma.ThemeVersionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ThemeVersionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemeVersionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ThemeVersionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemeVersionPayload>
          }
          findFirst: {
            args: Prisma.ThemeVersionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemeVersionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ThemeVersionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemeVersionPayload>
          }
          findMany: {
            args: Prisma.ThemeVersionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemeVersionPayload>[]
          }
          create: {
            args: Prisma.ThemeVersionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemeVersionPayload>
          }
          createMany: {
            args: Prisma.ThemeVersionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ThemeVersionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemeVersionPayload>[]
          }
          delete: {
            args: Prisma.ThemeVersionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemeVersionPayload>
          }
          update: {
            args: Prisma.ThemeVersionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemeVersionPayload>
          }
          deleteMany: {
            args: Prisma.ThemeVersionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ThemeVersionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ThemeVersionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThemeVersionPayload>
          }
          aggregate: {
            args: Prisma.ThemeVersionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateThemeVersion>
          }
          groupBy: {
            args: Prisma.ThemeVersionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ThemeVersionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ThemeVersionCountArgs<ExtArgs>
            result: $Utils.Optional<ThemeVersionCountAggregateOutputType> | number
          }
        }
      }
      Store: {
        payload: Prisma.$StorePayload<ExtArgs>
        fields: Prisma.StoreFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StoreFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StoreFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          findFirst: {
            args: Prisma.StoreFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StoreFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          findMany: {
            args: Prisma.StoreFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>[]
          }
          create: {
            args: Prisma.StoreCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          createMany: {
            args: Prisma.StoreCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StoreCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>[]
          }
          delete: {
            args: Prisma.StoreDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          update: {
            args: Prisma.StoreUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          deleteMany: {
            args: Prisma.StoreDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StoreUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StoreUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorePayload>
          }
          aggregate: {
            args: Prisma.StoreAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStore>
          }
          groupBy: {
            args: Prisma.StoreGroupByArgs<ExtArgs>
            result: $Utils.Optional<StoreGroupByOutputType>[]
          }
          count: {
            args: Prisma.StoreCountArgs<ExtArgs>
            result: $Utils.Optional<StoreCountAggregateOutputType> | number
          }
        }
      }
      StoreState: {
        payload: Prisma.$StoreStatePayload<ExtArgs>
        fields: Prisma.StoreStateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StoreStateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreStatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StoreStateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreStatePayload>
          }
          findFirst: {
            args: Prisma.StoreStateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreStatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StoreStateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreStatePayload>
          }
          findMany: {
            args: Prisma.StoreStateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreStatePayload>[]
          }
          create: {
            args: Prisma.StoreStateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreStatePayload>
          }
          createMany: {
            args: Prisma.StoreStateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StoreStateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreStatePayload>[]
          }
          delete: {
            args: Prisma.StoreStateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreStatePayload>
          }
          update: {
            args: Prisma.StoreStateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreStatePayload>
          }
          deleteMany: {
            args: Prisma.StoreStateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StoreStateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.StoreStateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoreStatePayload>
          }
          aggregate: {
            args: Prisma.StoreStateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStoreState>
          }
          groupBy: {
            args: Prisma.StoreStateGroupByArgs<ExtArgs>
            result: $Utils.Optional<StoreStateGroupByOutputType>[]
          }
          count: {
            args: Prisma.StoreStateCountArgs<ExtArgs>
            result: $Utils.Optional<StoreStateCountAggregateOutputType> | number
          }
        }
      }
      ComponentState: {
        payload: Prisma.$ComponentStatePayload<ExtArgs>
        fields: Prisma.ComponentStateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ComponentStateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ComponentStatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ComponentStateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ComponentStatePayload>
          }
          findFirst: {
            args: Prisma.ComponentStateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ComponentStatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ComponentStateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ComponentStatePayload>
          }
          findMany: {
            args: Prisma.ComponentStateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ComponentStatePayload>[]
          }
          create: {
            args: Prisma.ComponentStateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ComponentStatePayload>
          }
          createMany: {
            args: Prisma.ComponentStateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ComponentStateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ComponentStatePayload>[]
          }
          delete: {
            args: Prisma.ComponentStateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ComponentStatePayload>
          }
          update: {
            args: Prisma.ComponentStateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ComponentStatePayload>
          }
          deleteMany: {
            args: Prisma.ComponentStateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ComponentStateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ComponentStateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ComponentStatePayload>
          }
          aggregate: {
            args: Prisma.ComponentStateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateComponentState>
          }
          groupBy: {
            args: Prisma.ComponentStateGroupByArgs<ExtArgs>
            result: $Utils.Optional<ComponentStateGroupByOutputType>[]
          }
          count: {
            args: Prisma.ComponentStateCountArgs<ExtArgs>
            result: $Utils.Optional<ComponentStateCountAggregateOutputType> | number
          }
        }
      }
      PageComposition: {
        payload: Prisma.$PageCompositionPayload<ExtArgs>
        fields: Prisma.PageCompositionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PageCompositionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageCompositionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PageCompositionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageCompositionPayload>
          }
          findFirst: {
            args: Prisma.PageCompositionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageCompositionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PageCompositionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageCompositionPayload>
          }
          findMany: {
            args: Prisma.PageCompositionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageCompositionPayload>[]
          }
          create: {
            args: Prisma.PageCompositionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageCompositionPayload>
          }
          createMany: {
            args: Prisma.PageCompositionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PageCompositionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageCompositionPayload>[]
          }
          delete: {
            args: Prisma.PageCompositionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageCompositionPayload>
          }
          update: {
            args: Prisma.PageCompositionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageCompositionPayload>
          }
          deleteMany: {
            args: Prisma.PageCompositionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PageCompositionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PageCompositionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PageCompositionPayload>
          }
          aggregate: {
            args: Prisma.PageCompositionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePageComposition>
          }
          groupBy: {
            args: Prisma.PageCompositionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PageCompositionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PageCompositionCountArgs<ExtArgs>
            result: $Utils.Optional<PageCompositionCountAggregateOutputType> | number
          }
        }
      }
      DataEntity: {
        payload: Prisma.$DataEntityPayload<ExtArgs>
        fields: Prisma.DataEntityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DataEntityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataEntityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DataEntityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataEntityPayload>
          }
          findFirst: {
            args: Prisma.DataEntityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataEntityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DataEntityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataEntityPayload>
          }
          findMany: {
            args: Prisma.DataEntityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataEntityPayload>[]
          }
          create: {
            args: Prisma.DataEntityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataEntityPayload>
          }
          createMany: {
            args: Prisma.DataEntityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DataEntityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataEntityPayload>[]
          }
          delete: {
            args: Prisma.DataEntityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataEntityPayload>
          }
          update: {
            args: Prisma.DataEntityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataEntityPayload>
          }
          deleteMany: {
            args: Prisma.DataEntityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DataEntityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DataEntityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataEntityPayload>
          }
          aggregate: {
            args: Prisma.DataEntityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDataEntity>
          }
          groupBy: {
            args: Prisma.DataEntityGroupByArgs<ExtArgs>
            result: $Utils.Optional<DataEntityGroupByOutputType>[]
          }
          count: {
            args: Prisma.DataEntityCountArgs<ExtArgs>
            result: $Utils.Optional<DataEntityCountAggregateOutputType> | number
          }
        }
      }
      Collection: {
        payload: Prisma.$CollectionPayload<ExtArgs>
        fields: Prisma.CollectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CollectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CollectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>
          }
          findFirst: {
            args: Prisma.CollectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CollectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>
          }
          findMany: {
            args: Prisma.CollectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>[]
          }
          create: {
            args: Prisma.CollectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>
          }
          createMany: {
            args: Prisma.CollectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CollectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>[]
          }
          delete: {
            args: Prisma.CollectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>
          }
          update: {
            args: Prisma.CollectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>
          }
          deleteMany: {
            args: Prisma.CollectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CollectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CollectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionPayload>
          }
          aggregate: {
            args: Prisma.CollectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCollection>
          }
          groupBy: {
            args: Prisma.CollectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CollectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.CollectionCountArgs<ExtArgs>
            result: $Utils.Optional<CollectionCountAggregateOutputType> | number
          }
        }
      }
      CollectionItem: {
        payload: Prisma.$CollectionItemPayload<ExtArgs>
        fields: Prisma.CollectionItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CollectionItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CollectionItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionItemPayload>
          }
          findFirst: {
            args: Prisma.CollectionItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CollectionItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionItemPayload>
          }
          findMany: {
            args: Prisma.CollectionItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionItemPayload>[]
          }
          create: {
            args: Prisma.CollectionItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionItemPayload>
          }
          createMany: {
            args: Prisma.CollectionItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CollectionItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionItemPayload>[]
          }
          delete: {
            args: Prisma.CollectionItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionItemPayload>
          }
          update: {
            args: Prisma.CollectionItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionItemPayload>
          }
          deleteMany: {
            args: Prisma.CollectionItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CollectionItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CollectionItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollectionItemPayload>
          }
          aggregate: {
            args: Prisma.CollectionItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCollectionItem>
          }
          groupBy: {
            args: Prisma.CollectionItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<CollectionItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.CollectionItemCountArgs<ExtArgs>
            result: $Utils.Optional<CollectionItemCountAggregateOutputType> | number
          }
        }
      }
      DataBinding: {
        payload: Prisma.$DataBindingPayload<ExtArgs>
        fields: Prisma.DataBindingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DataBindingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataBindingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DataBindingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataBindingPayload>
          }
          findFirst: {
            args: Prisma.DataBindingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataBindingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DataBindingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataBindingPayload>
          }
          findMany: {
            args: Prisma.DataBindingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataBindingPayload>[]
          }
          create: {
            args: Prisma.DataBindingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataBindingPayload>
          }
          createMany: {
            args: Prisma.DataBindingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DataBindingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataBindingPayload>[]
          }
          delete: {
            args: Prisma.DataBindingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataBindingPayload>
          }
          update: {
            args: Prisma.DataBindingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataBindingPayload>
          }
          deleteMany: {
            args: Prisma.DataBindingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DataBindingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DataBindingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DataBindingPayload>
          }
          aggregate: {
            args: Prisma.DataBindingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDataBinding>
          }
          groupBy: {
            args: Prisma.DataBindingGroupByArgs<ExtArgs>
            result: $Utils.Optional<DataBindingGroupByOutputType>[]
          }
          count: {
            args: Prisma.DataBindingCountArgs<ExtArgs>
            result: $Utils.Optional<DataBindingCountAggregateOutputType> | number
          }
        }
      }
      Snapshot: {
        payload: Prisma.$SnapshotPayload<ExtArgs>
        fields: Prisma.SnapshotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SnapshotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SnapshotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>
          }
          findFirst: {
            args: Prisma.SnapshotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SnapshotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>
          }
          findMany: {
            args: Prisma.SnapshotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>[]
          }
          create: {
            args: Prisma.SnapshotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>
          }
          createMany: {
            args: Prisma.SnapshotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SnapshotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>[]
          }
          delete: {
            args: Prisma.SnapshotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>
          }
          update: {
            args: Prisma.SnapshotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>
          }
          deleteMany: {
            args: Prisma.SnapshotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SnapshotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SnapshotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnapshotPayload>
          }
          aggregate: {
            args: Prisma.SnapshotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSnapshot>
          }
          groupBy: {
            args: Prisma.SnapshotGroupByArgs<ExtArgs>
            result: $Utils.Optional<SnapshotGroupByOutputType>[]
          }
          count: {
            args: Prisma.SnapshotCountArgs<ExtArgs>
            result: $Utils.Optional<SnapshotCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ThemeCountOutputType
   */

  export type ThemeCountOutputType = {
    storeStates: number
    versions: number
    stores: number
  }

  export type ThemeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    storeStates?: boolean | ThemeCountOutputTypeCountStoreStatesArgs
    versions?: boolean | ThemeCountOutputTypeCountVersionsArgs
    stores?: boolean | ThemeCountOutputTypeCountStoresArgs
  }

  // Custom InputTypes
  /**
   * ThemeCountOutputType without action
   */
  export type ThemeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemeCountOutputType
     */
    select?: ThemeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ThemeCountOutputType without action
   */
  export type ThemeCountOutputTypeCountStoreStatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StoreStateWhereInput
  }

  /**
   * ThemeCountOutputType without action
   */
  export type ThemeCountOutputTypeCountVersionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ThemeVersionWhereInput
  }

  /**
   * ThemeCountOutputType without action
   */
  export type ThemeCountOutputTypeCountStoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StoreWhereInput
  }


  /**
   * Count Type ThemeVersionCountOutputType
   */

  export type ThemeVersionCountOutputType = {
    storeStates: number
    stores: number
  }

  export type ThemeVersionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    storeStates?: boolean | ThemeVersionCountOutputTypeCountStoreStatesArgs
    stores?: boolean | ThemeVersionCountOutputTypeCountStoresArgs
  }

  // Custom InputTypes
  /**
   * ThemeVersionCountOutputType without action
   */
  export type ThemeVersionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemeVersionCountOutputType
     */
    select?: ThemeVersionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ThemeVersionCountOutputType without action
   */
  export type ThemeVersionCountOutputTypeCountStoreStatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StoreStateWhereInput
  }

  /**
   * ThemeVersionCountOutputType without action
   */
  export type ThemeVersionCountOutputTypeCountStoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StoreWhereInput
  }


  /**
   * Count Type StoreCountOutputType
   */

  export type StoreCountOutputType = {
    collections: number
    componentStates: number
    dataBindings: number
    dataEntities: number
    pageCompositions: number
    snapshots: number
    storeStates: number
  }

  export type StoreCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    collections?: boolean | StoreCountOutputTypeCountCollectionsArgs
    componentStates?: boolean | StoreCountOutputTypeCountComponentStatesArgs
    dataBindings?: boolean | StoreCountOutputTypeCountDataBindingsArgs
    dataEntities?: boolean | StoreCountOutputTypeCountDataEntitiesArgs
    pageCompositions?: boolean | StoreCountOutputTypeCountPageCompositionsArgs
    snapshots?: boolean | StoreCountOutputTypeCountSnapshotsArgs
    storeStates?: boolean | StoreCountOutputTypeCountStoreStatesArgs
  }

  // Custom InputTypes
  /**
   * StoreCountOutputType without action
   */
  export type StoreCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreCountOutputType
     */
    select?: StoreCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StoreCountOutputType without action
   */
  export type StoreCountOutputTypeCountCollectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CollectionWhereInput
  }

  /**
   * StoreCountOutputType without action
   */
  export type StoreCountOutputTypeCountComponentStatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ComponentStateWhereInput
  }

  /**
   * StoreCountOutputType without action
   */
  export type StoreCountOutputTypeCountDataBindingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DataBindingWhereInput
  }

  /**
   * StoreCountOutputType without action
   */
  export type StoreCountOutputTypeCountDataEntitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DataEntityWhereInput
  }

  /**
   * StoreCountOutputType without action
   */
  export type StoreCountOutputTypeCountPageCompositionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PageCompositionWhereInput
  }

  /**
   * StoreCountOutputType without action
   */
  export type StoreCountOutputTypeCountSnapshotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SnapshotWhereInput
  }

  /**
   * StoreCountOutputType without action
   */
  export type StoreCountOutputTypeCountStoreStatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StoreStateWhereInput
  }


  /**
   * Count Type CollectionCountOutputType
   */

  export type CollectionCountOutputType = {
    items: number
  }

  export type CollectionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | CollectionCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * CollectionCountOutputType without action
   */
  export type CollectionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionCountOutputType
     */
    select?: CollectionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CollectionCountOutputType without action
   */
  export type CollectionCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CollectionItemWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Theme
   */

  export type AggregateTheme = {
    _count: ThemeCountAggregateOutputType | null
    _min: ThemeMinAggregateOutputType | null
    _max: ThemeMaxAggregateOutputType | null
  }

  export type ThemeMinAggregateOutputType = {
    id: string | null
    nameAr: string | null
    nameEn: string | null
    repository: string | null
    authorEmail: string | null
    supportUrl: string | null
    descriptionAr: string | null
    descriptionEn: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ThemeMaxAggregateOutputType = {
    id: string | null
    nameAr: string | null
    nameEn: string | null
    repository: string | null
    authorEmail: string | null
    supportUrl: string | null
    descriptionAr: string | null
    descriptionEn: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ThemeCountAggregateOutputType = {
    id: number
    nameAr: number
    nameEn: number
    repository: number
    authorEmail: number
    supportUrl: number
    descriptionAr: number
    descriptionEn: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ThemeMinAggregateInputType = {
    id?: true
    nameAr?: true
    nameEn?: true
    repository?: true
    authorEmail?: true
    supportUrl?: true
    descriptionAr?: true
    descriptionEn?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ThemeMaxAggregateInputType = {
    id?: true
    nameAr?: true
    nameEn?: true
    repository?: true
    authorEmail?: true
    supportUrl?: true
    descriptionAr?: true
    descriptionEn?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ThemeCountAggregateInputType = {
    id?: true
    nameAr?: true
    nameEn?: true
    repository?: true
    authorEmail?: true
    supportUrl?: true
    descriptionAr?: true
    descriptionEn?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ThemeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Theme to aggregate.
     */
    where?: ThemeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Themes to fetch.
     */
    orderBy?: ThemeOrderByWithRelationInput | ThemeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ThemeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Themes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Themes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Themes
    **/
    _count?: true | ThemeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ThemeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ThemeMaxAggregateInputType
  }

  export type GetThemeAggregateType<T extends ThemeAggregateArgs> = {
        [P in keyof T & keyof AggregateTheme]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTheme[P]>
      : GetScalarType<T[P], AggregateTheme[P]>
  }




  export type ThemeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ThemeWhereInput
    orderBy?: ThemeOrderByWithAggregationInput | ThemeOrderByWithAggregationInput[]
    by: ThemeScalarFieldEnum[] | ThemeScalarFieldEnum
    having?: ThemeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ThemeCountAggregateInputType | true
    _min?: ThemeMinAggregateInputType
    _max?: ThemeMaxAggregateInputType
  }

  export type ThemeGroupByOutputType = {
    id: string
    nameAr: string | null
    nameEn: string | null
    repository: string | null
    authorEmail: string | null
    supportUrl: string | null
    descriptionAr: string | null
    descriptionEn: string | null
    createdAt: Date
    updatedAt: Date
    _count: ThemeCountAggregateOutputType | null
    _min: ThemeMinAggregateOutputType | null
    _max: ThemeMaxAggregateOutputType | null
  }

  type GetThemeGroupByPayload<T extends ThemeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ThemeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ThemeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ThemeGroupByOutputType[P]>
            : GetScalarType<T[P], ThemeGroupByOutputType[P]>
        }
      >
    >


  export type ThemeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nameAr?: boolean
    nameEn?: boolean
    repository?: boolean
    authorEmail?: boolean
    supportUrl?: boolean
    descriptionAr?: boolean
    descriptionEn?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    storeStates?: boolean | Theme$storeStatesArgs<ExtArgs>
    versions?: boolean | Theme$versionsArgs<ExtArgs>
    stores?: boolean | Theme$storesArgs<ExtArgs>
    _count?: boolean | ThemeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["theme"]>

  export type ThemeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nameAr?: boolean
    nameEn?: boolean
    repository?: boolean
    authorEmail?: boolean
    supportUrl?: boolean
    descriptionAr?: boolean
    descriptionEn?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["theme"]>

  export type ThemeSelectScalar = {
    id?: boolean
    nameAr?: boolean
    nameEn?: boolean
    repository?: boolean
    authorEmail?: boolean
    supportUrl?: boolean
    descriptionAr?: boolean
    descriptionEn?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ThemeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    storeStates?: boolean | Theme$storeStatesArgs<ExtArgs>
    versions?: boolean | Theme$versionsArgs<ExtArgs>
    stores?: boolean | Theme$storesArgs<ExtArgs>
    _count?: boolean | ThemeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ThemeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ThemePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Theme"
    objects: {
      storeStates: Prisma.$StoreStatePayload<ExtArgs>[]
      versions: Prisma.$ThemeVersionPayload<ExtArgs>[]
      stores: Prisma.$StorePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      nameAr: string | null
      nameEn: string | null
      repository: string | null
      authorEmail: string | null
      supportUrl: string | null
      descriptionAr: string | null
      descriptionEn: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["theme"]>
    composites: {}
  }

  type ThemeGetPayload<S extends boolean | null | undefined | ThemeDefaultArgs> = $Result.GetResult<Prisma.$ThemePayload, S>

  type ThemeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ThemeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ThemeCountAggregateInputType | true
    }

  export interface ThemeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Theme'], meta: { name: 'Theme' } }
    /**
     * Find zero or one Theme that matches the filter.
     * @param {ThemeFindUniqueArgs} args - Arguments to find a Theme
     * @example
     * // Get one Theme
     * const theme = await prisma.theme.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ThemeFindUniqueArgs>(args: SelectSubset<T, ThemeFindUniqueArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Theme that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ThemeFindUniqueOrThrowArgs} args - Arguments to find a Theme
     * @example
     * // Get one Theme
     * const theme = await prisma.theme.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ThemeFindUniqueOrThrowArgs>(args: SelectSubset<T, ThemeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Theme that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeFindFirstArgs} args - Arguments to find a Theme
     * @example
     * // Get one Theme
     * const theme = await prisma.theme.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ThemeFindFirstArgs>(args?: SelectSubset<T, ThemeFindFirstArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Theme that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeFindFirstOrThrowArgs} args - Arguments to find a Theme
     * @example
     * // Get one Theme
     * const theme = await prisma.theme.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ThemeFindFirstOrThrowArgs>(args?: SelectSubset<T, ThemeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Themes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Themes
     * const themes = await prisma.theme.findMany()
     * 
     * // Get first 10 Themes
     * const themes = await prisma.theme.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const themeWithIdOnly = await prisma.theme.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ThemeFindManyArgs>(args?: SelectSubset<T, ThemeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Theme.
     * @param {ThemeCreateArgs} args - Arguments to create a Theme.
     * @example
     * // Create one Theme
     * const Theme = await prisma.theme.create({
     *   data: {
     *     // ... data to create a Theme
     *   }
     * })
     * 
     */
    create<T extends ThemeCreateArgs>(args: SelectSubset<T, ThemeCreateArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Themes.
     * @param {ThemeCreateManyArgs} args - Arguments to create many Themes.
     * @example
     * // Create many Themes
     * const theme = await prisma.theme.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ThemeCreateManyArgs>(args?: SelectSubset<T, ThemeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Themes and returns the data saved in the database.
     * @param {ThemeCreateManyAndReturnArgs} args - Arguments to create many Themes.
     * @example
     * // Create many Themes
     * const theme = await prisma.theme.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Themes and only return the `id`
     * const themeWithIdOnly = await prisma.theme.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ThemeCreateManyAndReturnArgs>(args?: SelectSubset<T, ThemeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Theme.
     * @param {ThemeDeleteArgs} args - Arguments to delete one Theme.
     * @example
     * // Delete one Theme
     * const Theme = await prisma.theme.delete({
     *   where: {
     *     // ... filter to delete one Theme
     *   }
     * })
     * 
     */
    delete<T extends ThemeDeleteArgs>(args: SelectSubset<T, ThemeDeleteArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Theme.
     * @param {ThemeUpdateArgs} args - Arguments to update one Theme.
     * @example
     * // Update one Theme
     * const theme = await prisma.theme.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ThemeUpdateArgs>(args: SelectSubset<T, ThemeUpdateArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Themes.
     * @param {ThemeDeleteManyArgs} args - Arguments to filter Themes to delete.
     * @example
     * // Delete a few Themes
     * const { count } = await prisma.theme.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ThemeDeleteManyArgs>(args?: SelectSubset<T, ThemeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Themes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Themes
     * const theme = await prisma.theme.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ThemeUpdateManyArgs>(args: SelectSubset<T, ThemeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Theme.
     * @param {ThemeUpsertArgs} args - Arguments to update or create a Theme.
     * @example
     * // Update or create a Theme
     * const theme = await prisma.theme.upsert({
     *   create: {
     *     // ... data to create a Theme
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Theme we want to update
     *   }
     * })
     */
    upsert<T extends ThemeUpsertArgs>(args: SelectSubset<T, ThemeUpsertArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Themes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeCountArgs} args - Arguments to filter Themes to count.
     * @example
     * // Count the number of Themes
     * const count = await prisma.theme.count({
     *   where: {
     *     // ... the filter for the Themes we want to count
     *   }
     * })
    **/
    count<T extends ThemeCountArgs>(
      args?: Subset<T, ThemeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ThemeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Theme.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ThemeAggregateArgs>(args: Subset<T, ThemeAggregateArgs>): Prisma.PrismaPromise<GetThemeAggregateType<T>>

    /**
     * Group by Theme.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ThemeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ThemeGroupByArgs['orderBy'] }
        : { orderBy?: ThemeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ThemeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetThemeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Theme model
   */
  readonly fields: ThemeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Theme.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ThemeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    storeStates<T extends Theme$storeStatesArgs<ExtArgs> = {}>(args?: Subset<T, Theme$storeStatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StoreStatePayload<ExtArgs>, T, "findMany"> | Null>
    versions<T extends Theme$versionsArgs<ExtArgs> = {}>(args?: Subset<T, Theme$versionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThemeVersionPayload<ExtArgs>, T, "findMany"> | Null>
    stores<T extends Theme$storesArgs<ExtArgs> = {}>(args?: Subset<T, Theme$storesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Theme model
   */ 
  interface ThemeFieldRefs {
    readonly id: FieldRef<"Theme", 'String'>
    readonly nameAr: FieldRef<"Theme", 'String'>
    readonly nameEn: FieldRef<"Theme", 'String'>
    readonly repository: FieldRef<"Theme", 'String'>
    readonly authorEmail: FieldRef<"Theme", 'String'>
    readonly supportUrl: FieldRef<"Theme", 'String'>
    readonly descriptionAr: FieldRef<"Theme", 'String'>
    readonly descriptionEn: FieldRef<"Theme", 'String'>
    readonly createdAt: FieldRef<"Theme", 'DateTime'>
    readonly updatedAt: FieldRef<"Theme", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Theme findUnique
   */
  export type ThemeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * Filter, which Theme to fetch.
     */
    where: ThemeWhereUniqueInput
  }

  /**
   * Theme findUniqueOrThrow
   */
  export type ThemeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * Filter, which Theme to fetch.
     */
    where: ThemeWhereUniqueInput
  }

  /**
   * Theme findFirst
   */
  export type ThemeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * Filter, which Theme to fetch.
     */
    where?: ThemeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Themes to fetch.
     */
    orderBy?: ThemeOrderByWithRelationInput | ThemeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Themes.
     */
    cursor?: ThemeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Themes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Themes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Themes.
     */
    distinct?: ThemeScalarFieldEnum | ThemeScalarFieldEnum[]
  }

  /**
   * Theme findFirstOrThrow
   */
  export type ThemeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * Filter, which Theme to fetch.
     */
    where?: ThemeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Themes to fetch.
     */
    orderBy?: ThemeOrderByWithRelationInput | ThemeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Themes.
     */
    cursor?: ThemeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Themes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Themes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Themes.
     */
    distinct?: ThemeScalarFieldEnum | ThemeScalarFieldEnum[]
  }

  /**
   * Theme findMany
   */
  export type ThemeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * Filter, which Themes to fetch.
     */
    where?: ThemeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Themes to fetch.
     */
    orderBy?: ThemeOrderByWithRelationInput | ThemeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Themes.
     */
    cursor?: ThemeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Themes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Themes.
     */
    skip?: number
    distinct?: ThemeScalarFieldEnum | ThemeScalarFieldEnum[]
  }

  /**
   * Theme create
   */
  export type ThemeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * The data needed to create a Theme.
     */
    data: XOR<ThemeCreateInput, ThemeUncheckedCreateInput>
  }

  /**
   * Theme createMany
   */
  export type ThemeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Themes.
     */
    data: ThemeCreateManyInput | ThemeCreateManyInput[]
  }

  /**
   * Theme createManyAndReturn
   */
  export type ThemeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Themes.
     */
    data: ThemeCreateManyInput | ThemeCreateManyInput[]
  }

  /**
   * Theme update
   */
  export type ThemeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * The data needed to update a Theme.
     */
    data: XOR<ThemeUpdateInput, ThemeUncheckedUpdateInput>
    /**
     * Choose, which Theme to update.
     */
    where: ThemeWhereUniqueInput
  }

  /**
   * Theme updateMany
   */
  export type ThemeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Themes.
     */
    data: XOR<ThemeUpdateManyMutationInput, ThemeUncheckedUpdateManyInput>
    /**
     * Filter which Themes to update
     */
    where?: ThemeWhereInput
  }

  /**
   * Theme upsert
   */
  export type ThemeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * The filter to search for the Theme to update in case it exists.
     */
    where: ThemeWhereUniqueInput
    /**
     * In case the Theme found by the `where` argument doesn't exist, create a new Theme with this data.
     */
    create: XOR<ThemeCreateInput, ThemeUncheckedCreateInput>
    /**
     * In case the Theme was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ThemeUpdateInput, ThemeUncheckedUpdateInput>
  }

  /**
   * Theme delete
   */
  export type ThemeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
    /**
     * Filter which Theme to delete.
     */
    where: ThemeWhereUniqueInput
  }

  /**
   * Theme deleteMany
   */
  export type ThemeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Themes to delete
     */
    where?: ThemeWhereInput
  }

  /**
   * Theme.storeStates
   */
  export type Theme$storeStatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreState
     */
    select?: StoreStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreStateInclude<ExtArgs> | null
    where?: StoreStateWhereInput
    orderBy?: StoreStateOrderByWithRelationInput | StoreStateOrderByWithRelationInput[]
    cursor?: StoreStateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StoreStateScalarFieldEnum | StoreStateScalarFieldEnum[]
  }

  /**
   * Theme.versions
   */
  export type Theme$versionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemeVersion
     */
    select?: ThemeVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeVersionInclude<ExtArgs> | null
    where?: ThemeVersionWhereInput
    orderBy?: ThemeVersionOrderByWithRelationInput | ThemeVersionOrderByWithRelationInput[]
    cursor?: ThemeVersionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ThemeVersionScalarFieldEnum | ThemeVersionScalarFieldEnum[]
  }

  /**
   * Theme.stores
   */
  export type Theme$storesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    where?: StoreWhereInput
    orderBy?: StoreOrderByWithRelationInput | StoreOrderByWithRelationInput[]
    cursor?: StoreWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StoreScalarFieldEnum | StoreScalarFieldEnum[]
  }

  /**
   * Theme without action
   */
  export type ThemeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Theme
     */
    select?: ThemeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeInclude<ExtArgs> | null
  }


  /**
   * Model ThemeVersion
   */

  export type AggregateThemeVersion = {
    _count: ThemeVersionCountAggregateOutputType | null
    _min: ThemeVersionMinAggregateOutputType | null
    _max: ThemeVersionMaxAggregateOutputType | null
  }

  export type ThemeVersionMinAggregateOutputType = {
    id: string | null
    themeId: string | null
    version: string | null
    fsPath: string | null
    contractJson: string | null
    capabilitiesJson: string | null
    schemaHash: string | null
    createdAt: Date | null
  }

  export type ThemeVersionMaxAggregateOutputType = {
    id: string | null
    themeId: string | null
    version: string | null
    fsPath: string | null
    contractJson: string | null
    capabilitiesJson: string | null
    schemaHash: string | null
    createdAt: Date | null
  }

  export type ThemeVersionCountAggregateOutputType = {
    id: number
    themeId: number
    version: number
    fsPath: number
    contractJson: number
    capabilitiesJson: number
    schemaHash: number
    createdAt: number
    _all: number
  }


  export type ThemeVersionMinAggregateInputType = {
    id?: true
    themeId?: true
    version?: true
    fsPath?: true
    contractJson?: true
    capabilitiesJson?: true
    schemaHash?: true
    createdAt?: true
  }

  export type ThemeVersionMaxAggregateInputType = {
    id?: true
    themeId?: true
    version?: true
    fsPath?: true
    contractJson?: true
    capabilitiesJson?: true
    schemaHash?: true
    createdAt?: true
  }

  export type ThemeVersionCountAggregateInputType = {
    id?: true
    themeId?: true
    version?: true
    fsPath?: true
    contractJson?: true
    capabilitiesJson?: true
    schemaHash?: true
    createdAt?: true
    _all?: true
  }

  export type ThemeVersionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ThemeVersion to aggregate.
     */
    where?: ThemeVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ThemeVersions to fetch.
     */
    orderBy?: ThemeVersionOrderByWithRelationInput | ThemeVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ThemeVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ThemeVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ThemeVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ThemeVersions
    **/
    _count?: true | ThemeVersionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ThemeVersionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ThemeVersionMaxAggregateInputType
  }

  export type GetThemeVersionAggregateType<T extends ThemeVersionAggregateArgs> = {
        [P in keyof T & keyof AggregateThemeVersion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateThemeVersion[P]>
      : GetScalarType<T[P], AggregateThemeVersion[P]>
  }




  export type ThemeVersionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ThemeVersionWhereInput
    orderBy?: ThemeVersionOrderByWithAggregationInput | ThemeVersionOrderByWithAggregationInput[]
    by: ThemeVersionScalarFieldEnum[] | ThemeVersionScalarFieldEnum
    having?: ThemeVersionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ThemeVersionCountAggregateInputType | true
    _min?: ThemeVersionMinAggregateInputType
    _max?: ThemeVersionMaxAggregateInputType
  }

  export type ThemeVersionGroupByOutputType = {
    id: string
    themeId: string
    version: string
    fsPath: string
    contractJson: string
    capabilitiesJson: string | null
    schemaHash: string | null
    createdAt: Date
    _count: ThemeVersionCountAggregateOutputType | null
    _min: ThemeVersionMinAggregateOutputType | null
    _max: ThemeVersionMaxAggregateOutputType | null
  }

  type GetThemeVersionGroupByPayload<T extends ThemeVersionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ThemeVersionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ThemeVersionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ThemeVersionGroupByOutputType[P]>
            : GetScalarType<T[P], ThemeVersionGroupByOutputType[P]>
        }
      >
    >


  export type ThemeVersionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    themeId?: boolean
    version?: boolean
    fsPath?: boolean
    contractJson?: boolean
    capabilitiesJson?: boolean
    schemaHash?: boolean
    createdAt?: boolean
    storeStates?: boolean | ThemeVersion$storeStatesArgs<ExtArgs>
    theme?: boolean | ThemeDefaultArgs<ExtArgs>
    stores?: boolean | ThemeVersion$storesArgs<ExtArgs>
    _count?: boolean | ThemeVersionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["themeVersion"]>

  export type ThemeVersionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    themeId?: boolean
    version?: boolean
    fsPath?: boolean
    contractJson?: boolean
    capabilitiesJson?: boolean
    schemaHash?: boolean
    createdAt?: boolean
    theme?: boolean | ThemeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["themeVersion"]>

  export type ThemeVersionSelectScalar = {
    id?: boolean
    themeId?: boolean
    version?: boolean
    fsPath?: boolean
    contractJson?: boolean
    capabilitiesJson?: boolean
    schemaHash?: boolean
    createdAt?: boolean
  }

  export type ThemeVersionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    storeStates?: boolean | ThemeVersion$storeStatesArgs<ExtArgs>
    theme?: boolean | ThemeDefaultArgs<ExtArgs>
    stores?: boolean | ThemeVersion$storesArgs<ExtArgs>
    _count?: boolean | ThemeVersionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ThemeVersionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    theme?: boolean | ThemeDefaultArgs<ExtArgs>
  }

  export type $ThemeVersionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ThemeVersion"
    objects: {
      storeStates: Prisma.$StoreStatePayload<ExtArgs>[]
      theme: Prisma.$ThemePayload<ExtArgs>
      stores: Prisma.$StorePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      themeId: string
      version: string
      fsPath: string
      contractJson: string
      capabilitiesJson: string | null
      schemaHash: string | null
      createdAt: Date
    }, ExtArgs["result"]["themeVersion"]>
    composites: {}
  }

  type ThemeVersionGetPayload<S extends boolean | null | undefined | ThemeVersionDefaultArgs> = $Result.GetResult<Prisma.$ThemeVersionPayload, S>

  type ThemeVersionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ThemeVersionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ThemeVersionCountAggregateInputType | true
    }

  export interface ThemeVersionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ThemeVersion'], meta: { name: 'ThemeVersion' } }
    /**
     * Find zero or one ThemeVersion that matches the filter.
     * @param {ThemeVersionFindUniqueArgs} args - Arguments to find a ThemeVersion
     * @example
     * // Get one ThemeVersion
     * const themeVersion = await prisma.themeVersion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ThemeVersionFindUniqueArgs>(args: SelectSubset<T, ThemeVersionFindUniqueArgs<ExtArgs>>): Prisma__ThemeVersionClient<$Result.GetResult<Prisma.$ThemeVersionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ThemeVersion that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ThemeVersionFindUniqueOrThrowArgs} args - Arguments to find a ThemeVersion
     * @example
     * // Get one ThemeVersion
     * const themeVersion = await prisma.themeVersion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ThemeVersionFindUniqueOrThrowArgs>(args: SelectSubset<T, ThemeVersionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ThemeVersionClient<$Result.GetResult<Prisma.$ThemeVersionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ThemeVersion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeVersionFindFirstArgs} args - Arguments to find a ThemeVersion
     * @example
     * // Get one ThemeVersion
     * const themeVersion = await prisma.themeVersion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ThemeVersionFindFirstArgs>(args?: SelectSubset<T, ThemeVersionFindFirstArgs<ExtArgs>>): Prisma__ThemeVersionClient<$Result.GetResult<Prisma.$ThemeVersionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ThemeVersion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeVersionFindFirstOrThrowArgs} args - Arguments to find a ThemeVersion
     * @example
     * // Get one ThemeVersion
     * const themeVersion = await prisma.themeVersion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ThemeVersionFindFirstOrThrowArgs>(args?: SelectSubset<T, ThemeVersionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ThemeVersionClient<$Result.GetResult<Prisma.$ThemeVersionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ThemeVersions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeVersionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ThemeVersions
     * const themeVersions = await prisma.themeVersion.findMany()
     * 
     * // Get first 10 ThemeVersions
     * const themeVersions = await prisma.themeVersion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const themeVersionWithIdOnly = await prisma.themeVersion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ThemeVersionFindManyArgs>(args?: SelectSubset<T, ThemeVersionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThemeVersionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ThemeVersion.
     * @param {ThemeVersionCreateArgs} args - Arguments to create a ThemeVersion.
     * @example
     * // Create one ThemeVersion
     * const ThemeVersion = await prisma.themeVersion.create({
     *   data: {
     *     // ... data to create a ThemeVersion
     *   }
     * })
     * 
     */
    create<T extends ThemeVersionCreateArgs>(args: SelectSubset<T, ThemeVersionCreateArgs<ExtArgs>>): Prisma__ThemeVersionClient<$Result.GetResult<Prisma.$ThemeVersionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ThemeVersions.
     * @param {ThemeVersionCreateManyArgs} args - Arguments to create many ThemeVersions.
     * @example
     * // Create many ThemeVersions
     * const themeVersion = await prisma.themeVersion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ThemeVersionCreateManyArgs>(args?: SelectSubset<T, ThemeVersionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ThemeVersions and returns the data saved in the database.
     * @param {ThemeVersionCreateManyAndReturnArgs} args - Arguments to create many ThemeVersions.
     * @example
     * // Create many ThemeVersions
     * const themeVersion = await prisma.themeVersion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ThemeVersions and only return the `id`
     * const themeVersionWithIdOnly = await prisma.themeVersion.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ThemeVersionCreateManyAndReturnArgs>(args?: SelectSubset<T, ThemeVersionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThemeVersionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ThemeVersion.
     * @param {ThemeVersionDeleteArgs} args - Arguments to delete one ThemeVersion.
     * @example
     * // Delete one ThemeVersion
     * const ThemeVersion = await prisma.themeVersion.delete({
     *   where: {
     *     // ... filter to delete one ThemeVersion
     *   }
     * })
     * 
     */
    delete<T extends ThemeVersionDeleteArgs>(args: SelectSubset<T, ThemeVersionDeleteArgs<ExtArgs>>): Prisma__ThemeVersionClient<$Result.GetResult<Prisma.$ThemeVersionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ThemeVersion.
     * @param {ThemeVersionUpdateArgs} args - Arguments to update one ThemeVersion.
     * @example
     * // Update one ThemeVersion
     * const themeVersion = await prisma.themeVersion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ThemeVersionUpdateArgs>(args: SelectSubset<T, ThemeVersionUpdateArgs<ExtArgs>>): Prisma__ThemeVersionClient<$Result.GetResult<Prisma.$ThemeVersionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ThemeVersions.
     * @param {ThemeVersionDeleteManyArgs} args - Arguments to filter ThemeVersions to delete.
     * @example
     * // Delete a few ThemeVersions
     * const { count } = await prisma.themeVersion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ThemeVersionDeleteManyArgs>(args?: SelectSubset<T, ThemeVersionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ThemeVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeVersionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ThemeVersions
     * const themeVersion = await prisma.themeVersion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ThemeVersionUpdateManyArgs>(args: SelectSubset<T, ThemeVersionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ThemeVersion.
     * @param {ThemeVersionUpsertArgs} args - Arguments to update or create a ThemeVersion.
     * @example
     * // Update or create a ThemeVersion
     * const themeVersion = await prisma.themeVersion.upsert({
     *   create: {
     *     // ... data to create a ThemeVersion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ThemeVersion we want to update
     *   }
     * })
     */
    upsert<T extends ThemeVersionUpsertArgs>(args: SelectSubset<T, ThemeVersionUpsertArgs<ExtArgs>>): Prisma__ThemeVersionClient<$Result.GetResult<Prisma.$ThemeVersionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ThemeVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeVersionCountArgs} args - Arguments to filter ThemeVersions to count.
     * @example
     * // Count the number of ThemeVersions
     * const count = await prisma.themeVersion.count({
     *   where: {
     *     // ... the filter for the ThemeVersions we want to count
     *   }
     * })
    **/
    count<T extends ThemeVersionCountArgs>(
      args?: Subset<T, ThemeVersionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ThemeVersionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ThemeVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeVersionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ThemeVersionAggregateArgs>(args: Subset<T, ThemeVersionAggregateArgs>): Prisma.PrismaPromise<GetThemeVersionAggregateType<T>>

    /**
     * Group by ThemeVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThemeVersionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ThemeVersionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ThemeVersionGroupByArgs['orderBy'] }
        : { orderBy?: ThemeVersionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ThemeVersionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetThemeVersionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ThemeVersion model
   */
  readonly fields: ThemeVersionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ThemeVersion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ThemeVersionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    storeStates<T extends ThemeVersion$storeStatesArgs<ExtArgs> = {}>(args?: Subset<T, ThemeVersion$storeStatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StoreStatePayload<ExtArgs>, T, "findMany"> | Null>
    theme<T extends ThemeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ThemeDefaultArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    stores<T extends ThemeVersion$storesArgs<ExtArgs> = {}>(args?: Subset<T, ThemeVersion$storesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ThemeVersion model
   */ 
  interface ThemeVersionFieldRefs {
    readonly id: FieldRef<"ThemeVersion", 'String'>
    readonly themeId: FieldRef<"ThemeVersion", 'String'>
    readonly version: FieldRef<"ThemeVersion", 'String'>
    readonly fsPath: FieldRef<"ThemeVersion", 'String'>
    readonly contractJson: FieldRef<"ThemeVersion", 'String'>
    readonly capabilitiesJson: FieldRef<"ThemeVersion", 'String'>
    readonly schemaHash: FieldRef<"ThemeVersion", 'String'>
    readonly createdAt: FieldRef<"ThemeVersion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ThemeVersion findUnique
   */
  export type ThemeVersionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemeVersion
     */
    select?: ThemeVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeVersionInclude<ExtArgs> | null
    /**
     * Filter, which ThemeVersion to fetch.
     */
    where: ThemeVersionWhereUniqueInput
  }

  /**
   * ThemeVersion findUniqueOrThrow
   */
  export type ThemeVersionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemeVersion
     */
    select?: ThemeVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeVersionInclude<ExtArgs> | null
    /**
     * Filter, which ThemeVersion to fetch.
     */
    where: ThemeVersionWhereUniqueInput
  }

  /**
   * ThemeVersion findFirst
   */
  export type ThemeVersionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemeVersion
     */
    select?: ThemeVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeVersionInclude<ExtArgs> | null
    /**
     * Filter, which ThemeVersion to fetch.
     */
    where?: ThemeVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ThemeVersions to fetch.
     */
    orderBy?: ThemeVersionOrderByWithRelationInput | ThemeVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ThemeVersions.
     */
    cursor?: ThemeVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ThemeVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ThemeVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ThemeVersions.
     */
    distinct?: ThemeVersionScalarFieldEnum | ThemeVersionScalarFieldEnum[]
  }

  /**
   * ThemeVersion findFirstOrThrow
   */
  export type ThemeVersionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemeVersion
     */
    select?: ThemeVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeVersionInclude<ExtArgs> | null
    /**
     * Filter, which ThemeVersion to fetch.
     */
    where?: ThemeVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ThemeVersions to fetch.
     */
    orderBy?: ThemeVersionOrderByWithRelationInput | ThemeVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ThemeVersions.
     */
    cursor?: ThemeVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ThemeVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ThemeVersions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ThemeVersions.
     */
    distinct?: ThemeVersionScalarFieldEnum | ThemeVersionScalarFieldEnum[]
  }

  /**
   * ThemeVersion findMany
   */
  export type ThemeVersionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemeVersion
     */
    select?: ThemeVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeVersionInclude<ExtArgs> | null
    /**
     * Filter, which ThemeVersions to fetch.
     */
    where?: ThemeVersionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ThemeVersions to fetch.
     */
    orderBy?: ThemeVersionOrderByWithRelationInput | ThemeVersionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ThemeVersions.
     */
    cursor?: ThemeVersionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ThemeVersions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ThemeVersions.
     */
    skip?: number
    distinct?: ThemeVersionScalarFieldEnum | ThemeVersionScalarFieldEnum[]
  }

  /**
   * ThemeVersion create
   */
  export type ThemeVersionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemeVersion
     */
    select?: ThemeVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeVersionInclude<ExtArgs> | null
    /**
     * The data needed to create a ThemeVersion.
     */
    data: XOR<ThemeVersionCreateInput, ThemeVersionUncheckedCreateInput>
  }

  /**
   * ThemeVersion createMany
   */
  export type ThemeVersionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ThemeVersions.
     */
    data: ThemeVersionCreateManyInput | ThemeVersionCreateManyInput[]
  }

  /**
   * ThemeVersion createManyAndReturn
   */
  export type ThemeVersionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemeVersion
     */
    select?: ThemeVersionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ThemeVersions.
     */
    data: ThemeVersionCreateManyInput | ThemeVersionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeVersionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ThemeVersion update
   */
  export type ThemeVersionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemeVersion
     */
    select?: ThemeVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeVersionInclude<ExtArgs> | null
    /**
     * The data needed to update a ThemeVersion.
     */
    data: XOR<ThemeVersionUpdateInput, ThemeVersionUncheckedUpdateInput>
    /**
     * Choose, which ThemeVersion to update.
     */
    where: ThemeVersionWhereUniqueInput
  }

  /**
   * ThemeVersion updateMany
   */
  export type ThemeVersionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ThemeVersions.
     */
    data: XOR<ThemeVersionUpdateManyMutationInput, ThemeVersionUncheckedUpdateManyInput>
    /**
     * Filter which ThemeVersions to update
     */
    where?: ThemeVersionWhereInput
  }

  /**
   * ThemeVersion upsert
   */
  export type ThemeVersionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemeVersion
     */
    select?: ThemeVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeVersionInclude<ExtArgs> | null
    /**
     * The filter to search for the ThemeVersion to update in case it exists.
     */
    where: ThemeVersionWhereUniqueInput
    /**
     * In case the ThemeVersion found by the `where` argument doesn't exist, create a new ThemeVersion with this data.
     */
    create: XOR<ThemeVersionCreateInput, ThemeVersionUncheckedCreateInput>
    /**
     * In case the ThemeVersion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ThemeVersionUpdateInput, ThemeVersionUncheckedUpdateInput>
  }

  /**
   * ThemeVersion delete
   */
  export type ThemeVersionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemeVersion
     */
    select?: ThemeVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeVersionInclude<ExtArgs> | null
    /**
     * Filter which ThemeVersion to delete.
     */
    where: ThemeVersionWhereUniqueInput
  }

  /**
   * ThemeVersion deleteMany
   */
  export type ThemeVersionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ThemeVersions to delete
     */
    where?: ThemeVersionWhereInput
  }

  /**
   * ThemeVersion.storeStates
   */
  export type ThemeVersion$storeStatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreState
     */
    select?: StoreStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreStateInclude<ExtArgs> | null
    where?: StoreStateWhereInput
    orderBy?: StoreStateOrderByWithRelationInput | StoreStateOrderByWithRelationInput[]
    cursor?: StoreStateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StoreStateScalarFieldEnum | StoreStateScalarFieldEnum[]
  }

  /**
   * ThemeVersion.stores
   */
  export type ThemeVersion$storesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    where?: StoreWhereInput
    orderBy?: StoreOrderByWithRelationInput | StoreOrderByWithRelationInput[]
    cursor?: StoreWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StoreScalarFieldEnum | StoreScalarFieldEnum[]
  }

  /**
   * ThemeVersion without action
   */
  export type ThemeVersionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThemeVersion
     */
    select?: ThemeVersionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThemeVersionInclude<ExtArgs> | null
  }


  /**
   * Model Store
   */

  export type AggregateStore = {
    _count: StoreCountAggregateOutputType | null
    _min: StoreMinAggregateOutputType | null
    _max: StoreMaxAggregateOutputType | null
  }

  export type StoreMinAggregateOutputType = {
    id: string | null
    title: string | null
    defaultLocale: string | null
    defaultCurrency: string | null
    themeId: string | null
    themeVersionId: string | null
    activePage: string | null
    viewport: string | null
    settingsJson: string | null
    themeSettingsJson: string | null
    brandingJson: string | null
    isMaster: boolean | null
    parentStoreId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StoreMaxAggregateOutputType = {
    id: string | null
    title: string | null
    defaultLocale: string | null
    defaultCurrency: string | null
    themeId: string | null
    themeVersionId: string | null
    activePage: string | null
    viewport: string | null
    settingsJson: string | null
    themeSettingsJson: string | null
    brandingJson: string | null
    isMaster: boolean | null
    parentStoreId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type StoreCountAggregateOutputType = {
    id: number
    title: number
    defaultLocale: number
    defaultCurrency: number
    themeId: number
    themeVersionId: number
    activePage: number
    viewport: number
    settingsJson: number
    themeSettingsJson: number
    brandingJson: number
    isMaster: number
    parentStoreId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type StoreMinAggregateInputType = {
    id?: true
    title?: true
    defaultLocale?: true
    defaultCurrency?: true
    themeId?: true
    themeVersionId?: true
    activePage?: true
    viewport?: true
    settingsJson?: true
    themeSettingsJson?: true
    brandingJson?: true
    isMaster?: true
    parentStoreId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StoreMaxAggregateInputType = {
    id?: true
    title?: true
    defaultLocale?: true
    defaultCurrency?: true
    themeId?: true
    themeVersionId?: true
    activePage?: true
    viewport?: true
    settingsJson?: true
    themeSettingsJson?: true
    brandingJson?: true
    isMaster?: true
    parentStoreId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type StoreCountAggregateInputType = {
    id?: true
    title?: true
    defaultLocale?: true
    defaultCurrency?: true
    themeId?: true
    themeVersionId?: true
    activePage?: true
    viewport?: true
    settingsJson?: true
    themeSettingsJson?: true
    brandingJson?: true
    isMaster?: true
    parentStoreId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type StoreAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Store to aggregate.
     */
    where?: StoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stores to fetch.
     */
    orderBy?: StoreOrderByWithRelationInput | StoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Stores
    **/
    _count?: true | StoreCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StoreMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StoreMaxAggregateInputType
  }

  export type GetStoreAggregateType<T extends StoreAggregateArgs> = {
        [P in keyof T & keyof AggregateStore]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStore[P]>
      : GetScalarType<T[P], AggregateStore[P]>
  }




  export type StoreGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StoreWhereInput
    orderBy?: StoreOrderByWithAggregationInput | StoreOrderByWithAggregationInput[]
    by: StoreScalarFieldEnum[] | StoreScalarFieldEnum
    having?: StoreScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StoreCountAggregateInputType | true
    _min?: StoreMinAggregateInputType
    _max?: StoreMaxAggregateInputType
  }

  export type StoreGroupByOutputType = {
    id: string
    title: string
    defaultLocale: string
    defaultCurrency: string
    themeId: string
    themeVersionId: string
    activePage: string
    viewport: string
    settingsJson: string
    themeSettingsJson: string
    brandingJson: string | null
    isMaster: boolean
    parentStoreId: string | null
    createdAt: Date
    updatedAt: Date
    _count: StoreCountAggregateOutputType | null
    _min: StoreMinAggregateOutputType | null
    _max: StoreMaxAggregateOutputType | null
  }

  type GetStoreGroupByPayload<T extends StoreGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StoreGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StoreGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StoreGroupByOutputType[P]>
            : GetScalarType<T[P], StoreGroupByOutputType[P]>
        }
      >
    >


  export type StoreSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    defaultLocale?: boolean
    defaultCurrency?: boolean
    themeId?: boolean
    themeVersionId?: boolean
    activePage?: boolean
    viewport?: boolean
    settingsJson?: boolean
    themeSettingsJson?: boolean
    brandingJson?: boolean
    isMaster?: boolean
    parentStoreId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    theme?: boolean | ThemeDefaultArgs<ExtArgs>
    themeVersion?: boolean | ThemeVersionDefaultArgs<ExtArgs>
    collections?: boolean | Store$collectionsArgs<ExtArgs>
    componentStates?: boolean | Store$componentStatesArgs<ExtArgs>
    dataBindings?: boolean | Store$dataBindingsArgs<ExtArgs>
    dataEntities?: boolean | Store$dataEntitiesArgs<ExtArgs>
    pageCompositions?: boolean | Store$pageCompositionsArgs<ExtArgs>
    snapshots?: boolean | Store$snapshotsArgs<ExtArgs>
    storeStates?: boolean | Store$storeStatesArgs<ExtArgs>
    _count?: boolean | StoreCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["store"]>

  export type StoreSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    defaultLocale?: boolean
    defaultCurrency?: boolean
    themeId?: boolean
    themeVersionId?: boolean
    activePage?: boolean
    viewport?: boolean
    settingsJson?: boolean
    themeSettingsJson?: boolean
    brandingJson?: boolean
    isMaster?: boolean
    parentStoreId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    theme?: boolean | ThemeDefaultArgs<ExtArgs>
    themeVersion?: boolean | ThemeVersionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["store"]>

  export type StoreSelectScalar = {
    id?: boolean
    title?: boolean
    defaultLocale?: boolean
    defaultCurrency?: boolean
    themeId?: boolean
    themeVersionId?: boolean
    activePage?: boolean
    viewport?: boolean
    settingsJson?: boolean
    themeSettingsJson?: boolean
    brandingJson?: boolean
    isMaster?: boolean
    parentStoreId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type StoreInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    theme?: boolean | ThemeDefaultArgs<ExtArgs>
    themeVersion?: boolean | ThemeVersionDefaultArgs<ExtArgs>
    collections?: boolean | Store$collectionsArgs<ExtArgs>
    componentStates?: boolean | Store$componentStatesArgs<ExtArgs>
    dataBindings?: boolean | Store$dataBindingsArgs<ExtArgs>
    dataEntities?: boolean | Store$dataEntitiesArgs<ExtArgs>
    pageCompositions?: boolean | Store$pageCompositionsArgs<ExtArgs>
    snapshots?: boolean | Store$snapshotsArgs<ExtArgs>
    storeStates?: boolean | Store$storeStatesArgs<ExtArgs>
    _count?: boolean | StoreCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StoreIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    theme?: boolean | ThemeDefaultArgs<ExtArgs>
    themeVersion?: boolean | ThemeVersionDefaultArgs<ExtArgs>
  }

  export type $StorePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Store"
    objects: {
      theme: Prisma.$ThemePayload<ExtArgs>
      themeVersion: Prisma.$ThemeVersionPayload<ExtArgs>
      collections: Prisma.$CollectionPayload<ExtArgs>[]
      componentStates: Prisma.$ComponentStatePayload<ExtArgs>[]
      dataBindings: Prisma.$DataBindingPayload<ExtArgs>[]
      dataEntities: Prisma.$DataEntityPayload<ExtArgs>[]
      pageCompositions: Prisma.$PageCompositionPayload<ExtArgs>[]
      snapshots: Prisma.$SnapshotPayload<ExtArgs>[]
      storeStates: Prisma.$StoreStatePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      defaultLocale: string
      defaultCurrency: string
      themeId: string
      themeVersionId: string
      activePage: string
      viewport: string
      settingsJson: string
      themeSettingsJson: string
      brandingJson: string | null
      isMaster: boolean
      parentStoreId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["store"]>
    composites: {}
  }

  type StoreGetPayload<S extends boolean | null | undefined | StoreDefaultArgs> = $Result.GetResult<Prisma.$StorePayload, S>

  type StoreCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<StoreFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: StoreCountAggregateInputType | true
    }

  export interface StoreDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Store'], meta: { name: 'Store' } }
    /**
     * Find zero or one Store that matches the filter.
     * @param {StoreFindUniqueArgs} args - Arguments to find a Store
     * @example
     * // Get one Store
     * const store = await prisma.store.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StoreFindUniqueArgs>(args: SelectSubset<T, StoreFindUniqueArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Store that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {StoreFindUniqueOrThrowArgs} args - Arguments to find a Store
     * @example
     * // Get one Store
     * const store = await prisma.store.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StoreFindUniqueOrThrowArgs>(args: SelectSubset<T, StoreFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Store that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreFindFirstArgs} args - Arguments to find a Store
     * @example
     * // Get one Store
     * const store = await prisma.store.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StoreFindFirstArgs>(args?: SelectSubset<T, StoreFindFirstArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Store that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreFindFirstOrThrowArgs} args - Arguments to find a Store
     * @example
     * // Get one Store
     * const store = await prisma.store.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StoreFindFirstOrThrowArgs>(args?: SelectSubset<T, StoreFindFirstOrThrowArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Stores that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Stores
     * const stores = await prisma.store.findMany()
     * 
     * // Get first 10 Stores
     * const stores = await prisma.store.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const storeWithIdOnly = await prisma.store.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StoreFindManyArgs>(args?: SelectSubset<T, StoreFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Store.
     * @param {StoreCreateArgs} args - Arguments to create a Store.
     * @example
     * // Create one Store
     * const Store = await prisma.store.create({
     *   data: {
     *     // ... data to create a Store
     *   }
     * })
     * 
     */
    create<T extends StoreCreateArgs>(args: SelectSubset<T, StoreCreateArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Stores.
     * @param {StoreCreateManyArgs} args - Arguments to create many Stores.
     * @example
     * // Create many Stores
     * const store = await prisma.store.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StoreCreateManyArgs>(args?: SelectSubset<T, StoreCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Stores and returns the data saved in the database.
     * @param {StoreCreateManyAndReturnArgs} args - Arguments to create many Stores.
     * @example
     * // Create many Stores
     * const store = await prisma.store.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Stores and only return the `id`
     * const storeWithIdOnly = await prisma.store.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StoreCreateManyAndReturnArgs>(args?: SelectSubset<T, StoreCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Store.
     * @param {StoreDeleteArgs} args - Arguments to delete one Store.
     * @example
     * // Delete one Store
     * const Store = await prisma.store.delete({
     *   where: {
     *     // ... filter to delete one Store
     *   }
     * })
     * 
     */
    delete<T extends StoreDeleteArgs>(args: SelectSubset<T, StoreDeleteArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Store.
     * @param {StoreUpdateArgs} args - Arguments to update one Store.
     * @example
     * // Update one Store
     * const store = await prisma.store.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StoreUpdateArgs>(args: SelectSubset<T, StoreUpdateArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Stores.
     * @param {StoreDeleteManyArgs} args - Arguments to filter Stores to delete.
     * @example
     * // Delete a few Stores
     * const { count } = await prisma.store.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StoreDeleteManyArgs>(args?: SelectSubset<T, StoreDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Stores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Stores
     * const store = await prisma.store.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StoreUpdateManyArgs>(args: SelectSubset<T, StoreUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Store.
     * @param {StoreUpsertArgs} args - Arguments to update or create a Store.
     * @example
     * // Update or create a Store
     * const store = await prisma.store.upsert({
     *   create: {
     *     // ... data to create a Store
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Store we want to update
     *   }
     * })
     */
    upsert<T extends StoreUpsertArgs>(args: SelectSubset<T, StoreUpsertArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Stores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreCountArgs} args - Arguments to filter Stores to count.
     * @example
     * // Count the number of Stores
     * const count = await prisma.store.count({
     *   where: {
     *     // ... the filter for the Stores we want to count
     *   }
     * })
    **/
    count<T extends StoreCountArgs>(
      args?: Subset<T, StoreCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StoreCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Store.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StoreAggregateArgs>(args: Subset<T, StoreAggregateArgs>): Prisma.PrismaPromise<GetStoreAggregateType<T>>

    /**
     * Group by Store.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StoreGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StoreGroupByArgs['orderBy'] }
        : { orderBy?: StoreGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StoreGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStoreGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Store model
   */
  readonly fields: StoreFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Store.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StoreClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    theme<T extends ThemeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ThemeDefaultArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    themeVersion<T extends ThemeVersionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ThemeVersionDefaultArgs<ExtArgs>>): Prisma__ThemeVersionClient<$Result.GetResult<Prisma.$ThemeVersionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    collections<T extends Store$collectionsArgs<ExtArgs> = {}>(args?: Subset<T, Store$collectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findMany"> | Null>
    componentStates<T extends Store$componentStatesArgs<ExtArgs> = {}>(args?: Subset<T, Store$componentStatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ComponentStatePayload<ExtArgs>, T, "findMany"> | Null>
    dataBindings<T extends Store$dataBindingsArgs<ExtArgs> = {}>(args?: Subset<T, Store$dataBindingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataBindingPayload<ExtArgs>, T, "findMany"> | Null>
    dataEntities<T extends Store$dataEntitiesArgs<ExtArgs> = {}>(args?: Subset<T, Store$dataEntitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataEntityPayload<ExtArgs>, T, "findMany"> | Null>
    pageCompositions<T extends Store$pageCompositionsArgs<ExtArgs> = {}>(args?: Subset<T, Store$pageCompositionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PageCompositionPayload<ExtArgs>, T, "findMany"> | Null>
    snapshots<T extends Store$snapshotsArgs<ExtArgs> = {}>(args?: Subset<T, Store$snapshotsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "findMany"> | Null>
    storeStates<T extends Store$storeStatesArgs<ExtArgs> = {}>(args?: Subset<T, Store$storeStatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StoreStatePayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Store model
   */ 
  interface StoreFieldRefs {
    readonly id: FieldRef<"Store", 'String'>
    readonly title: FieldRef<"Store", 'String'>
    readonly defaultLocale: FieldRef<"Store", 'String'>
    readonly defaultCurrency: FieldRef<"Store", 'String'>
    readonly themeId: FieldRef<"Store", 'String'>
    readonly themeVersionId: FieldRef<"Store", 'String'>
    readonly activePage: FieldRef<"Store", 'String'>
    readonly viewport: FieldRef<"Store", 'String'>
    readonly settingsJson: FieldRef<"Store", 'String'>
    readonly themeSettingsJson: FieldRef<"Store", 'String'>
    readonly brandingJson: FieldRef<"Store", 'String'>
    readonly isMaster: FieldRef<"Store", 'Boolean'>
    readonly parentStoreId: FieldRef<"Store", 'String'>
    readonly createdAt: FieldRef<"Store", 'DateTime'>
    readonly updatedAt: FieldRef<"Store", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Store findUnique
   */
  export type StoreFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter, which Store to fetch.
     */
    where: StoreWhereUniqueInput
  }

  /**
   * Store findUniqueOrThrow
   */
  export type StoreFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter, which Store to fetch.
     */
    where: StoreWhereUniqueInput
  }

  /**
   * Store findFirst
   */
  export type StoreFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter, which Store to fetch.
     */
    where?: StoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stores to fetch.
     */
    orderBy?: StoreOrderByWithRelationInput | StoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Stores.
     */
    cursor?: StoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Stores.
     */
    distinct?: StoreScalarFieldEnum | StoreScalarFieldEnum[]
  }

  /**
   * Store findFirstOrThrow
   */
  export type StoreFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter, which Store to fetch.
     */
    where?: StoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stores to fetch.
     */
    orderBy?: StoreOrderByWithRelationInput | StoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Stores.
     */
    cursor?: StoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Stores.
     */
    distinct?: StoreScalarFieldEnum | StoreScalarFieldEnum[]
  }

  /**
   * Store findMany
   */
  export type StoreFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter, which Stores to fetch.
     */
    where?: StoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Stores to fetch.
     */
    orderBy?: StoreOrderByWithRelationInput | StoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Stores.
     */
    cursor?: StoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Stores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Stores.
     */
    skip?: number
    distinct?: StoreScalarFieldEnum | StoreScalarFieldEnum[]
  }

  /**
   * Store create
   */
  export type StoreCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * The data needed to create a Store.
     */
    data: XOR<StoreCreateInput, StoreUncheckedCreateInput>
  }

  /**
   * Store createMany
   */
  export type StoreCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Stores.
     */
    data: StoreCreateManyInput | StoreCreateManyInput[]
  }

  /**
   * Store createManyAndReturn
   */
  export type StoreCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Stores.
     */
    data: StoreCreateManyInput | StoreCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Store update
   */
  export type StoreUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * The data needed to update a Store.
     */
    data: XOR<StoreUpdateInput, StoreUncheckedUpdateInput>
    /**
     * Choose, which Store to update.
     */
    where: StoreWhereUniqueInput
  }

  /**
   * Store updateMany
   */
  export type StoreUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Stores.
     */
    data: XOR<StoreUpdateManyMutationInput, StoreUncheckedUpdateManyInput>
    /**
     * Filter which Stores to update
     */
    where?: StoreWhereInput
  }

  /**
   * Store upsert
   */
  export type StoreUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * The filter to search for the Store to update in case it exists.
     */
    where: StoreWhereUniqueInput
    /**
     * In case the Store found by the `where` argument doesn't exist, create a new Store with this data.
     */
    create: XOR<StoreCreateInput, StoreUncheckedCreateInput>
    /**
     * In case the Store was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StoreUpdateInput, StoreUncheckedUpdateInput>
  }

  /**
   * Store delete
   */
  export type StoreDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
    /**
     * Filter which Store to delete.
     */
    where: StoreWhereUniqueInput
  }

  /**
   * Store deleteMany
   */
  export type StoreDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Stores to delete
     */
    where?: StoreWhereInput
  }

  /**
   * Store.collections
   */
  export type Store$collectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    where?: CollectionWhereInput
    orderBy?: CollectionOrderByWithRelationInput | CollectionOrderByWithRelationInput[]
    cursor?: CollectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CollectionScalarFieldEnum | CollectionScalarFieldEnum[]
  }

  /**
   * Store.componentStates
   */
  export type Store$componentStatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComponentState
     */
    select?: ComponentStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComponentStateInclude<ExtArgs> | null
    where?: ComponentStateWhereInput
    orderBy?: ComponentStateOrderByWithRelationInput | ComponentStateOrderByWithRelationInput[]
    cursor?: ComponentStateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ComponentStateScalarFieldEnum | ComponentStateScalarFieldEnum[]
  }

  /**
   * Store.dataBindings
   */
  export type Store$dataBindingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataBinding
     */
    select?: DataBindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataBindingInclude<ExtArgs> | null
    where?: DataBindingWhereInput
    orderBy?: DataBindingOrderByWithRelationInput | DataBindingOrderByWithRelationInput[]
    cursor?: DataBindingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DataBindingScalarFieldEnum | DataBindingScalarFieldEnum[]
  }

  /**
   * Store.dataEntities
   */
  export type Store$dataEntitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataEntity
     */
    select?: DataEntitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataEntityInclude<ExtArgs> | null
    where?: DataEntityWhereInput
    orderBy?: DataEntityOrderByWithRelationInput | DataEntityOrderByWithRelationInput[]
    cursor?: DataEntityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DataEntityScalarFieldEnum | DataEntityScalarFieldEnum[]
  }

  /**
   * Store.pageCompositions
   */
  export type Store$pageCompositionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageComposition
     */
    select?: PageCompositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageCompositionInclude<ExtArgs> | null
    where?: PageCompositionWhereInput
    orderBy?: PageCompositionOrderByWithRelationInput | PageCompositionOrderByWithRelationInput[]
    cursor?: PageCompositionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PageCompositionScalarFieldEnum | PageCompositionScalarFieldEnum[]
  }

  /**
   * Store.snapshots
   */
  export type Store$snapshotsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
    where?: SnapshotWhereInput
    orderBy?: SnapshotOrderByWithRelationInput | SnapshotOrderByWithRelationInput[]
    cursor?: SnapshotWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SnapshotScalarFieldEnum | SnapshotScalarFieldEnum[]
  }

  /**
   * Store.storeStates
   */
  export type Store$storeStatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreState
     */
    select?: StoreStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreStateInclude<ExtArgs> | null
    where?: StoreStateWhereInput
    orderBy?: StoreStateOrderByWithRelationInput | StoreStateOrderByWithRelationInput[]
    cursor?: StoreStateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StoreStateScalarFieldEnum | StoreStateScalarFieldEnum[]
  }

  /**
   * Store without action
   */
  export type StoreDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Store
     */
    select?: StoreSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreInclude<ExtArgs> | null
  }


  /**
   * Model StoreState
   */

  export type AggregateStoreState = {
    _count: StoreStateCountAggregateOutputType | null
    _min: StoreStateMinAggregateOutputType | null
    _max: StoreStateMaxAggregateOutputType | null
  }

  export type StoreStateMinAggregateOutputType = {
    storeId: string | null
    themeId: string | null
    themeVersionId: string | null
    activePage: string | null
    viewport: string | null
    settingsJson: string | null
    updatedAt: Date | null
  }

  export type StoreStateMaxAggregateOutputType = {
    storeId: string | null
    themeId: string | null
    themeVersionId: string | null
    activePage: string | null
    viewport: string | null
    settingsJson: string | null
    updatedAt: Date | null
  }

  export type StoreStateCountAggregateOutputType = {
    storeId: number
    themeId: number
    themeVersionId: number
    activePage: number
    viewport: number
    settingsJson: number
    updatedAt: number
    _all: number
  }


  export type StoreStateMinAggregateInputType = {
    storeId?: true
    themeId?: true
    themeVersionId?: true
    activePage?: true
    viewport?: true
    settingsJson?: true
    updatedAt?: true
  }

  export type StoreStateMaxAggregateInputType = {
    storeId?: true
    themeId?: true
    themeVersionId?: true
    activePage?: true
    viewport?: true
    settingsJson?: true
    updatedAt?: true
  }

  export type StoreStateCountAggregateInputType = {
    storeId?: true
    themeId?: true
    themeVersionId?: true
    activePage?: true
    viewport?: true
    settingsJson?: true
    updatedAt?: true
    _all?: true
  }

  export type StoreStateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StoreState to aggregate.
     */
    where?: StoreStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoreStates to fetch.
     */
    orderBy?: StoreStateOrderByWithRelationInput | StoreStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StoreStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoreStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoreStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StoreStates
    **/
    _count?: true | StoreStateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StoreStateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StoreStateMaxAggregateInputType
  }

  export type GetStoreStateAggregateType<T extends StoreStateAggregateArgs> = {
        [P in keyof T & keyof AggregateStoreState]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStoreState[P]>
      : GetScalarType<T[P], AggregateStoreState[P]>
  }




  export type StoreStateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StoreStateWhereInput
    orderBy?: StoreStateOrderByWithAggregationInput | StoreStateOrderByWithAggregationInput[]
    by: StoreStateScalarFieldEnum[] | StoreStateScalarFieldEnum
    having?: StoreStateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StoreStateCountAggregateInputType | true
    _min?: StoreStateMinAggregateInputType
    _max?: StoreStateMaxAggregateInputType
  }

  export type StoreStateGroupByOutputType = {
    storeId: string
    themeId: string
    themeVersionId: string
    activePage: string
    viewport: string
    settingsJson: string
    updatedAt: Date
    _count: StoreStateCountAggregateOutputType | null
    _min: StoreStateMinAggregateOutputType | null
    _max: StoreStateMaxAggregateOutputType | null
  }

  type GetStoreStateGroupByPayload<T extends StoreStateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StoreStateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StoreStateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StoreStateGroupByOutputType[P]>
            : GetScalarType<T[P], StoreStateGroupByOutputType[P]>
        }
      >
    >


  export type StoreStateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    storeId?: boolean
    themeId?: boolean
    themeVersionId?: boolean
    activePage?: boolean
    viewport?: boolean
    settingsJson?: boolean
    updatedAt?: boolean
    themeVersion?: boolean | ThemeVersionDefaultArgs<ExtArgs>
    theme?: boolean | ThemeDefaultArgs<ExtArgs>
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["storeState"]>

  export type StoreStateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    storeId?: boolean
    themeId?: boolean
    themeVersionId?: boolean
    activePage?: boolean
    viewport?: boolean
    settingsJson?: boolean
    updatedAt?: boolean
    themeVersion?: boolean | ThemeVersionDefaultArgs<ExtArgs>
    theme?: boolean | ThemeDefaultArgs<ExtArgs>
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["storeState"]>

  export type StoreStateSelectScalar = {
    storeId?: boolean
    themeId?: boolean
    themeVersionId?: boolean
    activePage?: boolean
    viewport?: boolean
    settingsJson?: boolean
    updatedAt?: boolean
  }

  export type StoreStateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    themeVersion?: boolean | ThemeVersionDefaultArgs<ExtArgs>
    theme?: boolean | ThemeDefaultArgs<ExtArgs>
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }
  export type StoreStateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    themeVersion?: boolean | ThemeVersionDefaultArgs<ExtArgs>
    theme?: boolean | ThemeDefaultArgs<ExtArgs>
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }

  export type $StoreStatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StoreState"
    objects: {
      themeVersion: Prisma.$ThemeVersionPayload<ExtArgs>
      theme: Prisma.$ThemePayload<ExtArgs>
      store: Prisma.$StorePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      storeId: string
      themeId: string
      themeVersionId: string
      activePage: string
      viewport: string
      settingsJson: string
      updatedAt: Date
    }, ExtArgs["result"]["storeState"]>
    composites: {}
  }

  type StoreStateGetPayload<S extends boolean | null | undefined | StoreStateDefaultArgs> = $Result.GetResult<Prisma.$StoreStatePayload, S>

  type StoreStateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<StoreStateFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: StoreStateCountAggregateInputType | true
    }

  export interface StoreStateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StoreState'], meta: { name: 'StoreState' } }
    /**
     * Find zero or one StoreState that matches the filter.
     * @param {StoreStateFindUniqueArgs} args - Arguments to find a StoreState
     * @example
     * // Get one StoreState
     * const storeState = await prisma.storeState.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StoreStateFindUniqueArgs>(args: SelectSubset<T, StoreStateFindUniqueArgs<ExtArgs>>): Prisma__StoreStateClient<$Result.GetResult<Prisma.$StoreStatePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one StoreState that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {StoreStateFindUniqueOrThrowArgs} args - Arguments to find a StoreState
     * @example
     * // Get one StoreState
     * const storeState = await prisma.storeState.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StoreStateFindUniqueOrThrowArgs>(args: SelectSubset<T, StoreStateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StoreStateClient<$Result.GetResult<Prisma.$StoreStatePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first StoreState that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreStateFindFirstArgs} args - Arguments to find a StoreState
     * @example
     * // Get one StoreState
     * const storeState = await prisma.storeState.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StoreStateFindFirstArgs>(args?: SelectSubset<T, StoreStateFindFirstArgs<ExtArgs>>): Prisma__StoreStateClient<$Result.GetResult<Prisma.$StoreStatePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first StoreState that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreStateFindFirstOrThrowArgs} args - Arguments to find a StoreState
     * @example
     * // Get one StoreState
     * const storeState = await prisma.storeState.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StoreStateFindFirstOrThrowArgs>(args?: SelectSubset<T, StoreStateFindFirstOrThrowArgs<ExtArgs>>): Prisma__StoreStateClient<$Result.GetResult<Prisma.$StoreStatePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more StoreStates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreStateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StoreStates
     * const storeStates = await prisma.storeState.findMany()
     * 
     * // Get first 10 StoreStates
     * const storeStates = await prisma.storeState.findMany({ take: 10 })
     * 
     * // Only select the `storeId`
     * const storeStateWithStoreIdOnly = await prisma.storeState.findMany({ select: { storeId: true } })
     * 
     */
    findMany<T extends StoreStateFindManyArgs>(args?: SelectSubset<T, StoreStateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StoreStatePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a StoreState.
     * @param {StoreStateCreateArgs} args - Arguments to create a StoreState.
     * @example
     * // Create one StoreState
     * const StoreState = await prisma.storeState.create({
     *   data: {
     *     // ... data to create a StoreState
     *   }
     * })
     * 
     */
    create<T extends StoreStateCreateArgs>(args: SelectSubset<T, StoreStateCreateArgs<ExtArgs>>): Prisma__StoreStateClient<$Result.GetResult<Prisma.$StoreStatePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many StoreStates.
     * @param {StoreStateCreateManyArgs} args - Arguments to create many StoreStates.
     * @example
     * // Create many StoreStates
     * const storeState = await prisma.storeState.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StoreStateCreateManyArgs>(args?: SelectSubset<T, StoreStateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StoreStates and returns the data saved in the database.
     * @param {StoreStateCreateManyAndReturnArgs} args - Arguments to create many StoreStates.
     * @example
     * // Create many StoreStates
     * const storeState = await prisma.storeState.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StoreStates and only return the `storeId`
     * const storeStateWithStoreIdOnly = await prisma.storeState.createManyAndReturn({ 
     *   select: { storeId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StoreStateCreateManyAndReturnArgs>(args?: SelectSubset<T, StoreStateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StoreStatePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a StoreState.
     * @param {StoreStateDeleteArgs} args - Arguments to delete one StoreState.
     * @example
     * // Delete one StoreState
     * const StoreState = await prisma.storeState.delete({
     *   where: {
     *     // ... filter to delete one StoreState
     *   }
     * })
     * 
     */
    delete<T extends StoreStateDeleteArgs>(args: SelectSubset<T, StoreStateDeleteArgs<ExtArgs>>): Prisma__StoreStateClient<$Result.GetResult<Prisma.$StoreStatePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one StoreState.
     * @param {StoreStateUpdateArgs} args - Arguments to update one StoreState.
     * @example
     * // Update one StoreState
     * const storeState = await prisma.storeState.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StoreStateUpdateArgs>(args: SelectSubset<T, StoreStateUpdateArgs<ExtArgs>>): Prisma__StoreStateClient<$Result.GetResult<Prisma.$StoreStatePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more StoreStates.
     * @param {StoreStateDeleteManyArgs} args - Arguments to filter StoreStates to delete.
     * @example
     * // Delete a few StoreStates
     * const { count } = await prisma.storeState.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StoreStateDeleteManyArgs>(args?: SelectSubset<T, StoreStateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StoreStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreStateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StoreStates
     * const storeState = await prisma.storeState.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StoreStateUpdateManyArgs>(args: SelectSubset<T, StoreStateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one StoreState.
     * @param {StoreStateUpsertArgs} args - Arguments to update or create a StoreState.
     * @example
     * // Update or create a StoreState
     * const storeState = await prisma.storeState.upsert({
     *   create: {
     *     // ... data to create a StoreState
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StoreState we want to update
     *   }
     * })
     */
    upsert<T extends StoreStateUpsertArgs>(args: SelectSubset<T, StoreStateUpsertArgs<ExtArgs>>): Prisma__StoreStateClient<$Result.GetResult<Prisma.$StoreStatePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of StoreStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreStateCountArgs} args - Arguments to filter StoreStates to count.
     * @example
     * // Count the number of StoreStates
     * const count = await prisma.storeState.count({
     *   where: {
     *     // ... the filter for the StoreStates we want to count
     *   }
     * })
    **/
    count<T extends StoreStateCountArgs>(
      args?: Subset<T, StoreStateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StoreStateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StoreState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreStateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StoreStateAggregateArgs>(args: Subset<T, StoreStateAggregateArgs>): Prisma.PrismaPromise<GetStoreStateAggregateType<T>>

    /**
     * Group by StoreState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoreStateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StoreStateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StoreStateGroupByArgs['orderBy'] }
        : { orderBy?: StoreStateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StoreStateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStoreStateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StoreState model
   */
  readonly fields: StoreStateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StoreState.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StoreStateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    themeVersion<T extends ThemeVersionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ThemeVersionDefaultArgs<ExtArgs>>): Prisma__ThemeVersionClient<$Result.GetResult<Prisma.$ThemeVersionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    theme<T extends ThemeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ThemeDefaultArgs<ExtArgs>>): Prisma__ThemeClient<$Result.GetResult<Prisma.$ThemePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    store<T extends StoreDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StoreDefaultArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StoreState model
   */ 
  interface StoreStateFieldRefs {
    readonly storeId: FieldRef<"StoreState", 'String'>
    readonly themeId: FieldRef<"StoreState", 'String'>
    readonly themeVersionId: FieldRef<"StoreState", 'String'>
    readonly activePage: FieldRef<"StoreState", 'String'>
    readonly viewport: FieldRef<"StoreState", 'String'>
    readonly settingsJson: FieldRef<"StoreState", 'String'>
    readonly updatedAt: FieldRef<"StoreState", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StoreState findUnique
   */
  export type StoreStateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreState
     */
    select?: StoreStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreStateInclude<ExtArgs> | null
    /**
     * Filter, which StoreState to fetch.
     */
    where: StoreStateWhereUniqueInput
  }

  /**
   * StoreState findUniqueOrThrow
   */
  export type StoreStateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreState
     */
    select?: StoreStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreStateInclude<ExtArgs> | null
    /**
     * Filter, which StoreState to fetch.
     */
    where: StoreStateWhereUniqueInput
  }

  /**
   * StoreState findFirst
   */
  export type StoreStateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreState
     */
    select?: StoreStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreStateInclude<ExtArgs> | null
    /**
     * Filter, which StoreState to fetch.
     */
    where?: StoreStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoreStates to fetch.
     */
    orderBy?: StoreStateOrderByWithRelationInput | StoreStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StoreStates.
     */
    cursor?: StoreStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoreStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoreStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StoreStates.
     */
    distinct?: StoreStateScalarFieldEnum | StoreStateScalarFieldEnum[]
  }

  /**
   * StoreState findFirstOrThrow
   */
  export type StoreStateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreState
     */
    select?: StoreStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreStateInclude<ExtArgs> | null
    /**
     * Filter, which StoreState to fetch.
     */
    where?: StoreStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoreStates to fetch.
     */
    orderBy?: StoreStateOrderByWithRelationInput | StoreStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StoreStates.
     */
    cursor?: StoreStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoreStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoreStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StoreStates.
     */
    distinct?: StoreStateScalarFieldEnum | StoreStateScalarFieldEnum[]
  }

  /**
   * StoreState findMany
   */
  export type StoreStateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreState
     */
    select?: StoreStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreStateInclude<ExtArgs> | null
    /**
     * Filter, which StoreStates to fetch.
     */
    where?: StoreStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoreStates to fetch.
     */
    orderBy?: StoreStateOrderByWithRelationInput | StoreStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StoreStates.
     */
    cursor?: StoreStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoreStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoreStates.
     */
    skip?: number
    distinct?: StoreStateScalarFieldEnum | StoreStateScalarFieldEnum[]
  }

  /**
   * StoreState create
   */
  export type StoreStateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreState
     */
    select?: StoreStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreStateInclude<ExtArgs> | null
    /**
     * The data needed to create a StoreState.
     */
    data: XOR<StoreStateCreateInput, StoreStateUncheckedCreateInput>
  }

  /**
   * StoreState createMany
   */
  export type StoreStateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StoreStates.
     */
    data: StoreStateCreateManyInput | StoreStateCreateManyInput[]
  }

  /**
   * StoreState createManyAndReturn
   */
  export type StoreStateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreState
     */
    select?: StoreStateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many StoreStates.
     */
    data: StoreStateCreateManyInput | StoreStateCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreStateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StoreState update
   */
  export type StoreStateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreState
     */
    select?: StoreStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreStateInclude<ExtArgs> | null
    /**
     * The data needed to update a StoreState.
     */
    data: XOR<StoreStateUpdateInput, StoreStateUncheckedUpdateInput>
    /**
     * Choose, which StoreState to update.
     */
    where: StoreStateWhereUniqueInput
  }

  /**
   * StoreState updateMany
   */
  export type StoreStateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StoreStates.
     */
    data: XOR<StoreStateUpdateManyMutationInput, StoreStateUncheckedUpdateManyInput>
    /**
     * Filter which StoreStates to update
     */
    where?: StoreStateWhereInput
  }

  /**
   * StoreState upsert
   */
  export type StoreStateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreState
     */
    select?: StoreStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreStateInclude<ExtArgs> | null
    /**
     * The filter to search for the StoreState to update in case it exists.
     */
    where: StoreStateWhereUniqueInput
    /**
     * In case the StoreState found by the `where` argument doesn't exist, create a new StoreState with this data.
     */
    create: XOR<StoreStateCreateInput, StoreStateUncheckedCreateInput>
    /**
     * In case the StoreState was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StoreStateUpdateInput, StoreStateUncheckedUpdateInput>
  }

  /**
   * StoreState delete
   */
  export type StoreStateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreState
     */
    select?: StoreStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreStateInclude<ExtArgs> | null
    /**
     * Filter which StoreState to delete.
     */
    where: StoreStateWhereUniqueInput
  }

  /**
   * StoreState deleteMany
   */
  export type StoreStateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StoreStates to delete
     */
    where?: StoreStateWhereInput
  }

  /**
   * StoreState without action
   */
  export type StoreStateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoreState
     */
    select?: StoreStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoreStateInclude<ExtArgs> | null
  }


  /**
   * Model ComponentState
   */

  export type AggregateComponentState = {
    _count: ComponentStateCountAggregateOutputType | null
    _avg: ComponentStateAvgAggregateOutputType | null
    _sum: ComponentStateSumAggregateOutputType | null
    _min: ComponentStateMinAggregateOutputType | null
    _max: ComponentStateMaxAggregateOutputType | null
  }

  export type ComponentStateAvgAggregateOutputType = {
    instanceOrder: number | null
  }

  export type ComponentStateSumAggregateOutputType = {
    instanceOrder: number | null
  }

  export type ComponentStateMinAggregateOutputType = {
    id: string | null
    storeId: string | null
    componentPath: string | null
    componentKey: string | null
    instanceOrder: number | null
    settingsJson: string | null
    visibilityJson: string | null
    updatedAt: Date | null
  }

  export type ComponentStateMaxAggregateOutputType = {
    id: string | null
    storeId: string | null
    componentPath: string | null
    componentKey: string | null
    instanceOrder: number | null
    settingsJson: string | null
    visibilityJson: string | null
    updatedAt: Date | null
  }

  export type ComponentStateCountAggregateOutputType = {
    id: number
    storeId: number
    componentPath: number
    componentKey: number
    instanceOrder: number
    settingsJson: number
    visibilityJson: number
    updatedAt: number
    _all: number
  }


  export type ComponentStateAvgAggregateInputType = {
    instanceOrder?: true
  }

  export type ComponentStateSumAggregateInputType = {
    instanceOrder?: true
  }

  export type ComponentStateMinAggregateInputType = {
    id?: true
    storeId?: true
    componentPath?: true
    componentKey?: true
    instanceOrder?: true
    settingsJson?: true
    visibilityJson?: true
    updatedAt?: true
  }

  export type ComponentStateMaxAggregateInputType = {
    id?: true
    storeId?: true
    componentPath?: true
    componentKey?: true
    instanceOrder?: true
    settingsJson?: true
    visibilityJson?: true
    updatedAt?: true
  }

  export type ComponentStateCountAggregateInputType = {
    id?: true
    storeId?: true
    componentPath?: true
    componentKey?: true
    instanceOrder?: true
    settingsJson?: true
    visibilityJson?: true
    updatedAt?: true
    _all?: true
  }

  export type ComponentStateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ComponentState to aggregate.
     */
    where?: ComponentStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ComponentStates to fetch.
     */
    orderBy?: ComponentStateOrderByWithRelationInput | ComponentStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ComponentStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ComponentStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ComponentStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ComponentStates
    **/
    _count?: true | ComponentStateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ComponentStateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ComponentStateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ComponentStateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ComponentStateMaxAggregateInputType
  }

  export type GetComponentStateAggregateType<T extends ComponentStateAggregateArgs> = {
        [P in keyof T & keyof AggregateComponentState]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateComponentState[P]>
      : GetScalarType<T[P], AggregateComponentState[P]>
  }




  export type ComponentStateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ComponentStateWhereInput
    orderBy?: ComponentStateOrderByWithAggregationInput | ComponentStateOrderByWithAggregationInput[]
    by: ComponentStateScalarFieldEnum[] | ComponentStateScalarFieldEnum
    having?: ComponentStateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ComponentStateCountAggregateInputType | true
    _avg?: ComponentStateAvgAggregateInputType
    _sum?: ComponentStateSumAggregateInputType
    _min?: ComponentStateMinAggregateInputType
    _max?: ComponentStateMaxAggregateInputType
  }

  export type ComponentStateGroupByOutputType = {
    id: string
    storeId: string
    componentPath: string
    componentKey: string | null
    instanceOrder: number
    settingsJson: string
    visibilityJson: string | null
    updatedAt: Date
    _count: ComponentStateCountAggregateOutputType | null
    _avg: ComponentStateAvgAggregateOutputType | null
    _sum: ComponentStateSumAggregateOutputType | null
    _min: ComponentStateMinAggregateOutputType | null
    _max: ComponentStateMaxAggregateOutputType | null
  }

  type GetComponentStateGroupByPayload<T extends ComponentStateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ComponentStateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ComponentStateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ComponentStateGroupByOutputType[P]>
            : GetScalarType<T[P], ComponentStateGroupByOutputType[P]>
        }
      >
    >


  export type ComponentStateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    storeId?: boolean
    componentPath?: boolean
    componentKey?: boolean
    instanceOrder?: boolean
    settingsJson?: boolean
    visibilityJson?: boolean
    updatedAt?: boolean
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["componentState"]>

  export type ComponentStateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    storeId?: boolean
    componentPath?: boolean
    componentKey?: boolean
    instanceOrder?: boolean
    settingsJson?: boolean
    visibilityJson?: boolean
    updatedAt?: boolean
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["componentState"]>

  export type ComponentStateSelectScalar = {
    id?: boolean
    storeId?: boolean
    componentPath?: boolean
    componentKey?: boolean
    instanceOrder?: boolean
    settingsJson?: boolean
    visibilityJson?: boolean
    updatedAt?: boolean
  }

  export type ComponentStateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }
  export type ComponentStateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }

  export type $ComponentStatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ComponentState"
    objects: {
      store: Prisma.$StorePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      storeId: string
      componentPath: string
      componentKey: string | null
      instanceOrder: number
      settingsJson: string
      visibilityJson: string | null
      updatedAt: Date
    }, ExtArgs["result"]["componentState"]>
    composites: {}
  }

  type ComponentStateGetPayload<S extends boolean | null | undefined | ComponentStateDefaultArgs> = $Result.GetResult<Prisma.$ComponentStatePayload, S>

  type ComponentStateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ComponentStateFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ComponentStateCountAggregateInputType | true
    }

  export interface ComponentStateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ComponentState'], meta: { name: 'ComponentState' } }
    /**
     * Find zero or one ComponentState that matches the filter.
     * @param {ComponentStateFindUniqueArgs} args - Arguments to find a ComponentState
     * @example
     * // Get one ComponentState
     * const componentState = await prisma.componentState.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ComponentStateFindUniqueArgs>(args: SelectSubset<T, ComponentStateFindUniqueArgs<ExtArgs>>): Prisma__ComponentStateClient<$Result.GetResult<Prisma.$ComponentStatePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ComponentState that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ComponentStateFindUniqueOrThrowArgs} args - Arguments to find a ComponentState
     * @example
     * // Get one ComponentState
     * const componentState = await prisma.componentState.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ComponentStateFindUniqueOrThrowArgs>(args: SelectSubset<T, ComponentStateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ComponentStateClient<$Result.GetResult<Prisma.$ComponentStatePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ComponentState that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComponentStateFindFirstArgs} args - Arguments to find a ComponentState
     * @example
     * // Get one ComponentState
     * const componentState = await prisma.componentState.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ComponentStateFindFirstArgs>(args?: SelectSubset<T, ComponentStateFindFirstArgs<ExtArgs>>): Prisma__ComponentStateClient<$Result.GetResult<Prisma.$ComponentStatePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ComponentState that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComponentStateFindFirstOrThrowArgs} args - Arguments to find a ComponentState
     * @example
     * // Get one ComponentState
     * const componentState = await prisma.componentState.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ComponentStateFindFirstOrThrowArgs>(args?: SelectSubset<T, ComponentStateFindFirstOrThrowArgs<ExtArgs>>): Prisma__ComponentStateClient<$Result.GetResult<Prisma.$ComponentStatePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ComponentStates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComponentStateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ComponentStates
     * const componentStates = await prisma.componentState.findMany()
     * 
     * // Get first 10 ComponentStates
     * const componentStates = await prisma.componentState.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const componentStateWithIdOnly = await prisma.componentState.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ComponentStateFindManyArgs>(args?: SelectSubset<T, ComponentStateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ComponentStatePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ComponentState.
     * @param {ComponentStateCreateArgs} args - Arguments to create a ComponentState.
     * @example
     * // Create one ComponentState
     * const ComponentState = await prisma.componentState.create({
     *   data: {
     *     // ... data to create a ComponentState
     *   }
     * })
     * 
     */
    create<T extends ComponentStateCreateArgs>(args: SelectSubset<T, ComponentStateCreateArgs<ExtArgs>>): Prisma__ComponentStateClient<$Result.GetResult<Prisma.$ComponentStatePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ComponentStates.
     * @param {ComponentStateCreateManyArgs} args - Arguments to create many ComponentStates.
     * @example
     * // Create many ComponentStates
     * const componentState = await prisma.componentState.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ComponentStateCreateManyArgs>(args?: SelectSubset<T, ComponentStateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ComponentStates and returns the data saved in the database.
     * @param {ComponentStateCreateManyAndReturnArgs} args - Arguments to create many ComponentStates.
     * @example
     * // Create many ComponentStates
     * const componentState = await prisma.componentState.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ComponentStates and only return the `id`
     * const componentStateWithIdOnly = await prisma.componentState.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ComponentStateCreateManyAndReturnArgs>(args?: SelectSubset<T, ComponentStateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ComponentStatePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ComponentState.
     * @param {ComponentStateDeleteArgs} args - Arguments to delete one ComponentState.
     * @example
     * // Delete one ComponentState
     * const ComponentState = await prisma.componentState.delete({
     *   where: {
     *     // ... filter to delete one ComponentState
     *   }
     * })
     * 
     */
    delete<T extends ComponentStateDeleteArgs>(args: SelectSubset<T, ComponentStateDeleteArgs<ExtArgs>>): Prisma__ComponentStateClient<$Result.GetResult<Prisma.$ComponentStatePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ComponentState.
     * @param {ComponentStateUpdateArgs} args - Arguments to update one ComponentState.
     * @example
     * // Update one ComponentState
     * const componentState = await prisma.componentState.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ComponentStateUpdateArgs>(args: SelectSubset<T, ComponentStateUpdateArgs<ExtArgs>>): Prisma__ComponentStateClient<$Result.GetResult<Prisma.$ComponentStatePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ComponentStates.
     * @param {ComponentStateDeleteManyArgs} args - Arguments to filter ComponentStates to delete.
     * @example
     * // Delete a few ComponentStates
     * const { count } = await prisma.componentState.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ComponentStateDeleteManyArgs>(args?: SelectSubset<T, ComponentStateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ComponentStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComponentStateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ComponentStates
     * const componentState = await prisma.componentState.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ComponentStateUpdateManyArgs>(args: SelectSubset<T, ComponentStateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ComponentState.
     * @param {ComponentStateUpsertArgs} args - Arguments to update or create a ComponentState.
     * @example
     * // Update or create a ComponentState
     * const componentState = await prisma.componentState.upsert({
     *   create: {
     *     // ... data to create a ComponentState
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ComponentState we want to update
     *   }
     * })
     */
    upsert<T extends ComponentStateUpsertArgs>(args: SelectSubset<T, ComponentStateUpsertArgs<ExtArgs>>): Prisma__ComponentStateClient<$Result.GetResult<Prisma.$ComponentStatePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ComponentStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComponentStateCountArgs} args - Arguments to filter ComponentStates to count.
     * @example
     * // Count the number of ComponentStates
     * const count = await prisma.componentState.count({
     *   where: {
     *     // ... the filter for the ComponentStates we want to count
     *   }
     * })
    **/
    count<T extends ComponentStateCountArgs>(
      args?: Subset<T, ComponentStateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ComponentStateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ComponentState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComponentStateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ComponentStateAggregateArgs>(args: Subset<T, ComponentStateAggregateArgs>): Prisma.PrismaPromise<GetComponentStateAggregateType<T>>

    /**
     * Group by ComponentState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ComponentStateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ComponentStateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ComponentStateGroupByArgs['orderBy'] }
        : { orderBy?: ComponentStateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ComponentStateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetComponentStateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ComponentState model
   */
  readonly fields: ComponentStateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ComponentState.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ComponentStateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    store<T extends StoreDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StoreDefaultArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ComponentState model
   */ 
  interface ComponentStateFieldRefs {
    readonly id: FieldRef<"ComponentState", 'String'>
    readonly storeId: FieldRef<"ComponentState", 'String'>
    readonly componentPath: FieldRef<"ComponentState", 'String'>
    readonly componentKey: FieldRef<"ComponentState", 'String'>
    readonly instanceOrder: FieldRef<"ComponentState", 'Int'>
    readonly settingsJson: FieldRef<"ComponentState", 'String'>
    readonly visibilityJson: FieldRef<"ComponentState", 'String'>
    readonly updatedAt: FieldRef<"ComponentState", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ComponentState findUnique
   */
  export type ComponentStateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComponentState
     */
    select?: ComponentStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComponentStateInclude<ExtArgs> | null
    /**
     * Filter, which ComponentState to fetch.
     */
    where: ComponentStateWhereUniqueInput
  }

  /**
   * ComponentState findUniqueOrThrow
   */
  export type ComponentStateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComponentState
     */
    select?: ComponentStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComponentStateInclude<ExtArgs> | null
    /**
     * Filter, which ComponentState to fetch.
     */
    where: ComponentStateWhereUniqueInput
  }

  /**
   * ComponentState findFirst
   */
  export type ComponentStateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComponentState
     */
    select?: ComponentStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComponentStateInclude<ExtArgs> | null
    /**
     * Filter, which ComponentState to fetch.
     */
    where?: ComponentStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ComponentStates to fetch.
     */
    orderBy?: ComponentStateOrderByWithRelationInput | ComponentStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ComponentStates.
     */
    cursor?: ComponentStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ComponentStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ComponentStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ComponentStates.
     */
    distinct?: ComponentStateScalarFieldEnum | ComponentStateScalarFieldEnum[]
  }

  /**
   * ComponentState findFirstOrThrow
   */
  export type ComponentStateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComponentState
     */
    select?: ComponentStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComponentStateInclude<ExtArgs> | null
    /**
     * Filter, which ComponentState to fetch.
     */
    where?: ComponentStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ComponentStates to fetch.
     */
    orderBy?: ComponentStateOrderByWithRelationInput | ComponentStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ComponentStates.
     */
    cursor?: ComponentStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ComponentStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ComponentStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ComponentStates.
     */
    distinct?: ComponentStateScalarFieldEnum | ComponentStateScalarFieldEnum[]
  }

  /**
   * ComponentState findMany
   */
  export type ComponentStateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComponentState
     */
    select?: ComponentStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComponentStateInclude<ExtArgs> | null
    /**
     * Filter, which ComponentStates to fetch.
     */
    where?: ComponentStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ComponentStates to fetch.
     */
    orderBy?: ComponentStateOrderByWithRelationInput | ComponentStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ComponentStates.
     */
    cursor?: ComponentStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ComponentStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ComponentStates.
     */
    skip?: number
    distinct?: ComponentStateScalarFieldEnum | ComponentStateScalarFieldEnum[]
  }

  /**
   * ComponentState create
   */
  export type ComponentStateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComponentState
     */
    select?: ComponentStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComponentStateInclude<ExtArgs> | null
    /**
     * The data needed to create a ComponentState.
     */
    data: XOR<ComponentStateCreateInput, ComponentStateUncheckedCreateInput>
  }

  /**
   * ComponentState createMany
   */
  export type ComponentStateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ComponentStates.
     */
    data: ComponentStateCreateManyInput | ComponentStateCreateManyInput[]
  }

  /**
   * ComponentState createManyAndReturn
   */
  export type ComponentStateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComponentState
     */
    select?: ComponentStateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ComponentStates.
     */
    data: ComponentStateCreateManyInput | ComponentStateCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComponentStateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ComponentState update
   */
  export type ComponentStateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComponentState
     */
    select?: ComponentStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComponentStateInclude<ExtArgs> | null
    /**
     * The data needed to update a ComponentState.
     */
    data: XOR<ComponentStateUpdateInput, ComponentStateUncheckedUpdateInput>
    /**
     * Choose, which ComponentState to update.
     */
    where: ComponentStateWhereUniqueInput
  }

  /**
   * ComponentState updateMany
   */
  export type ComponentStateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ComponentStates.
     */
    data: XOR<ComponentStateUpdateManyMutationInput, ComponentStateUncheckedUpdateManyInput>
    /**
     * Filter which ComponentStates to update
     */
    where?: ComponentStateWhereInput
  }

  /**
   * ComponentState upsert
   */
  export type ComponentStateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComponentState
     */
    select?: ComponentStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComponentStateInclude<ExtArgs> | null
    /**
     * The filter to search for the ComponentState to update in case it exists.
     */
    where: ComponentStateWhereUniqueInput
    /**
     * In case the ComponentState found by the `where` argument doesn't exist, create a new ComponentState with this data.
     */
    create: XOR<ComponentStateCreateInput, ComponentStateUncheckedCreateInput>
    /**
     * In case the ComponentState was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ComponentStateUpdateInput, ComponentStateUncheckedUpdateInput>
  }

  /**
   * ComponentState delete
   */
  export type ComponentStateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComponentState
     */
    select?: ComponentStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComponentStateInclude<ExtArgs> | null
    /**
     * Filter which ComponentState to delete.
     */
    where: ComponentStateWhereUniqueInput
  }

  /**
   * ComponentState deleteMany
   */
  export type ComponentStateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ComponentStates to delete
     */
    where?: ComponentStateWhereInput
  }

  /**
   * ComponentState without action
   */
  export type ComponentStateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ComponentState
     */
    select?: ComponentStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ComponentStateInclude<ExtArgs> | null
  }


  /**
   * Model PageComposition
   */

  export type AggregatePageComposition = {
    _count: PageCompositionCountAggregateOutputType | null
    _min: PageCompositionMinAggregateOutputType | null
    _max: PageCompositionMaxAggregateOutputType | null
  }

  export type PageCompositionMinAggregateOutputType = {
    id: string | null
    storeId: string | null
    page: string | null
    compositionJson: string | null
    updatedAt: Date | null
  }

  export type PageCompositionMaxAggregateOutputType = {
    id: string | null
    storeId: string | null
    page: string | null
    compositionJson: string | null
    updatedAt: Date | null
  }

  export type PageCompositionCountAggregateOutputType = {
    id: number
    storeId: number
    page: number
    compositionJson: number
    updatedAt: number
    _all: number
  }


  export type PageCompositionMinAggregateInputType = {
    id?: true
    storeId?: true
    page?: true
    compositionJson?: true
    updatedAt?: true
  }

  export type PageCompositionMaxAggregateInputType = {
    id?: true
    storeId?: true
    page?: true
    compositionJson?: true
    updatedAt?: true
  }

  export type PageCompositionCountAggregateInputType = {
    id?: true
    storeId?: true
    page?: true
    compositionJson?: true
    updatedAt?: true
    _all?: true
  }

  export type PageCompositionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PageComposition to aggregate.
     */
    where?: PageCompositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PageCompositions to fetch.
     */
    orderBy?: PageCompositionOrderByWithRelationInput | PageCompositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PageCompositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PageCompositions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PageCompositions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PageCompositions
    **/
    _count?: true | PageCompositionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PageCompositionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PageCompositionMaxAggregateInputType
  }

  export type GetPageCompositionAggregateType<T extends PageCompositionAggregateArgs> = {
        [P in keyof T & keyof AggregatePageComposition]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePageComposition[P]>
      : GetScalarType<T[P], AggregatePageComposition[P]>
  }




  export type PageCompositionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PageCompositionWhereInput
    orderBy?: PageCompositionOrderByWithAggregationInput | PageCompositionOrderByWithAggregationInput[]
    by: PageCompositionScalarFieldEnum[] | PageCompositionScalarFieldEnum
    having?: PageCompositionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PageCompositionCountAggregateInputType | true
    _min?: PageCompositionMinAggregateInputType
    _max?: PageCompositionMaxAggregateInputType
  }

  export type PageCompositionGroupByOutputType = {
    id: string
    storeId: string
    page: string
    compositionJson: string
    updatedAt: Date
    _count: PageCompositionCountAggregateOutputType | null
    _min: PageCompositionMinAggregateOutputType | null
    _max: PageCompositionMaxAggregateOutputType | null
  }

  type GetPageCompositionGroupByPayload<T extends PageCompositionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PageCompositionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PageCompositionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PageCompositionGroupByOutputType[P]>
            : GetScalarType<T[P], PageCompositionGroupByOutputType[P]>
        }
      >
    >


  export type PageCompositionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    storeId?: boolean
    page?: boolean
    compositionJson?: boolean
    updatedAt?: boolean
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pageComposition"]>

  export type PageCompositionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    storeId?: boolean
    page?: boolean
    compositionJson?: boolean
    updatedAt?: boolean
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pageComposition"]>

  export type PageCompositionSelectScalar = {
    id?: boolean
    storeId?: boolean
    page?: boolean
    compositionJson?: boolean
    updatedAt?: boolean
  }

  export type PageCompositionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }
  export type PageCompositionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }

  export type $PageCompositionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PageComposition"
    objects: {
      store: Prisma.$StorePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      storeId: string
      page: string
      compositionJson: string
      updatedAt: Date
    }, ExtArgs["result"]["pageComposition"]>
    composites: {}
  }

  type PageCompositionGetPayload<S extends boolean | null | undefined | PageCompositionDefaultArgs> = $Result.GetResult<Prisma.$PageCompositionPayload, S>

  type PageCompositionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PageCompositionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PageCompositionCountAggregateInputType | true
    }

  export interface PageCompositionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PageComposition'], meta: { name: 'PageComposition' } }
    /**
     * Find zero or one PageComposition that matches the filter.
     * @param {PageCompositionFindUniqueArgs} args - Arguments to find a PageComposition
     * @example
     * // Get one PageComposition
     * const pageComposition = await prisma.pageComposition.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PageCompositionFindUniqueArgs>(args: SelectSubset<T, PageCompositionFindUniqueArgs<ExtArgs>>): Prisma__PageCompositionClient<$Result.GetResult<Prisma.$PageCompositionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PageComposition that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PageCompositionFindUniqueOrThrowArgs} args - Arguments to find a PageComposition
     * @example
     * // Get one PageComposition
     * const pageComposition = await prisma.pageComposition.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PageCompositionFindUniqueOrThrowArgs>(args: SelectSubset<T, PageCompositionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PageCompositionClient<$Result.GetResult<Prisma.$PageCompositionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PageComposition that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageCompositionFindFirstArgs} args - Arguments to find a PageComposition
     * @example
     * // Get one PageComposition
     * const pageComposition = await prisma.pageComposition.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PageCompositionFindFirstArgs>(args?: SelectSubset<T, PageCompositionFindFirstArgs<ExtArgs>>): Prisma__PageCompositionClient<$Result.GetResult<Prisma.$PageCompositionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PageComposition that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageCompositionFindFirstOrThrowArgs} args - Arguments to find a PageComposition
     * @example
     * // Get one PageComposition
     * const pageComposition = await prisma.pageComposition.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PageCompositionFindFirstOrThrowArgs>(args?: SelectSubset<T, PageCompositionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PageCompositionClient<$Result.GetResult<Prisma.$PageCompositionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PageCompositions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageCompositionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PageCompositions
     * const pageCompositions = await prisma.pageComposition.findMany()
     * 
     * // Get first 10 PageCompositions
     * const pageCompositions = await prisma.pageComposition.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pageCompositionWithIdOnly = await prisma.pageComposition.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PageCompositionFindManyArgs>(args?: SelectSubset<T, PageCompositionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PageCompositionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PageComposition.
     * @param {PageCompositionCreateArgs} args - Arguments to create a PageComposition.
     * @example
     * // Create one PageComposition
     * const PageComposition = await prisma.pageComposition.create({
     *   data: {
     *     // ... data to create a PageComposition
     *   }
     * })
     * 
     */
    create<T extends PageCompositionCreateArgs>(args: SelectSubset<T, PageCompositionCreateArgs<ExtArgs>>): Prisma__PageCompositionClient<$Result.GetResult<Prisma.$PageCompositionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PageCompositions.
     * @param {PageCompositionCreateManyArgs} args - Arguments to create many PageCompositions.
     * @example
     * // Create many PageCompositions
     * const pageComposition = await prisma.pageComposition.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PageCompositionCreateManyArgs>(args?: SelectSubset<T, PageCompositionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PageCompositions and returns the data saved in the database.
     * @param {PageCompositionCreateManyAndReturnArgs} args - Arguments to create many PageCompositions.
     * @example
     * // Create many PageCompositions
     * const pageComposition = await prisma.pageComposition.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PageCompositions and only return the `id`
     * const pageCompositionWithIdOnly = await prisma.pageComposition.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PageCompositionCreateManyAndReturnArgs>(args?: SelectSubset<T, PageCompositionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PageCompositionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PageComposition.
     * @param {PageCompositionDeleteArgs} args - Arguments to delete one PageComposition.
     * @example
     * // Delete one PageComposition
     * const PageComposition = await prisma.pageComposition.delete({
     *   where: {
     *     // ... filter to delete one PageComposition
     *   }
     * })
     * 
     */
    delete<T extends PageCompositionDeleteArgs>(args: SelectSubset<T, PageCompositionDeleteArgs<ExtArgs>>): Prisma__PageCompositionClient<$Result.GetResult<Prisma.$PageCompositionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PageComposition.
     * @param {PageCompositionUpdateArgs} args - Arguments to update one PageComposition.
     * @example
     * // Update one PageComposition
     * const pageComposition = await prisma.pageComposition.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PageCompositionUpdateArgs>(args: SelectSubset<T, PageCompositionUpdateArgs<ExtArgs>>): Prisma__PageCompositionClient<$Result.GetResult<Prisma.$PageCompositionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PageCompositions.
     * @param {PageCompositionDeleteManyArgs} args - Arguments to filter PageCompositions to delete.
     * @example
     * // Delete a few PageCompositions
     * const { count } = await prisma.pageComposition.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PageCompositionDeleteManyArgs>(args?: SelectSubset<T, PageCompositionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PageCompositions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageCompositionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PageCompositions
     * const pageComposition = await prisma.pageComposition.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PageCompositionUpdateManyArgs>(args: SelectSubset<T, PageCompositionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PageComposition.
     * @param {PageCompositionUpsertArgs} args - Arguments to update or create a PageComposition.
     * @example
     * // Update or create a PageComposition
     * const pageComposition = await prisma.pageComposition.upsert({
     *   create: {
     *     // ... data to create a PageComposition
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PageComposition we want to update
     *   }
     * })
     */
    upsert<T extends PageCompositionUpsertArgs>(args: SelectSubset<T, PageCompositionUpsertArgs<ExtArgs>>): Prisma__PageCompositionClient<$Result.GetResult<Prisma.$PageCompositionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PageCompositions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageCompositionCountArgs} args - Arguments to filter PageCompositions to count.
     * @example
     * // Count the number of PageCompositions
     * const count = await prisma.pageComposition.count({
     *   where: {
     *     // ... the filter for the PageCompositions we want to count
     *   }
     * })
    **/
    count<T extends PageCompositionCountArgs>(
      args?: Subset<T, PageCompositionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PageCompositionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PageComposition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageCompositionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PageCompositionAggregateArgs>(args: Subset<T, PageCompositionAggregateArgs>): Prisma.PrismaPromise<GetPageCompositionAggregateType<T>>

    /**
     * Group by PageComposition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PageCompositionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PageCompositionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PageCompositionGroupByArgs['orderBy'] }
        : { orderBy?: PageCompositionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PageCompositionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPageCompositionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PageComposition model
   */
  readonly fields: PageCompositionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PageComposition.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PageCompositionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    store<T extends StoreDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StoreDefaultArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PageComposition model
   */ 
  interface PageCompositionFieldRefs {
    readonly id: FieldRef<"PageComposition", 'String'>
    readonly storeId: FieldRef<"PageComposition", 'String'>
    readonly page: FieldRef<"PageComposition", 'String'>
    readonly compositionJson: FieldRef<"PageComposition", 'String'>
    readonly updatedAt: FieldRef<"PageComposition", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PageComposition findUnique
   */
  export type PageCompositionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageComposition
     */
    select?: PageCompositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageCompositionInclude<ExtArgs> | null
    /**
     * Filter, which PageComposition to fetch.
     */
    where: PageCompositionWhereUniqueInput
  }

  /**
   * PageComposition findUniqueOrThrow
   */
  export type PageCompositionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageComposition
     */
    select?: PageCompositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageCompositionInclude<ExtArgs> | null
    /**
     * Filter, which PageComposition to fetch.
     */
    where: PageCompositionWhereUniqueInput
  }

  /**
   * PageComposition findFirst
   */
  export type PageCompositionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageComposition
     */
    select?: PageCompositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageCompositionInclude<ExtArgs> | null
    /**
     * Filter, which PageComposition to fetch.
     */
    where?: PageCompositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PageCompositions to fetch.
     */
    orderBy?: PageCompositionOrderByWithRelationInput | PageCompositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PageCompositions.
     */
    cursor?: PageCompositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PageCompositions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PageCompositions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PageCompositions.
     */
    distinct?: PageCompositionScalarFieldEnum | PageCompositionScalarFieldEnum[]
  }

  /**
   * PageComposition findFirstOrThrow
   */
  export type PageCompositionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageComposition
     */
    select?: PageCompositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageCompositionInclude<ExtArgs> | null
    /**
     * Filter, which PageComposition to fetch.
     */
    where?: PageCompositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PageCompositions to fetch.
     */
    orderBy?: PageCompositionOrderByWithRelationInput | PageCompositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PageCompositions.
     */
    cursor?: PageCompositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PageCompositions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PageCompositions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PageCompositions.
     */
    distinct?: PageCompositionScalarFieldEnum | PageCompositionScalarFieldEnum[]
  }

  /**
   * PageComposition findMany
   */
  export type PageCompositionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageComposition
     */
    select?: PageCompositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageCompositionInclude<ExtArgs> | null
    /**
     * Filter, which PageCompositions to fetch.
     */
    where?: PageCompositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PageCompositions to fetch.
     */
    orderBy?: PageCompositionOrderByWithRelationInput | PageCompositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PageCompositions.
     */
    cursor?: PageCompositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PageCompositions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PageCompositions.
     */
    skip?: number
    distinct?: PageCompositionScalarFieldEnum | PageCompositionScalarFieldEnum[]
  }

  /**
   * PageComposition create
   */
  export type PageCompositionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageComposition
     */
    select?: PageCompositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageCompositionInclude<ExtArgs> | null
    /**
     * The data needed to create a PageComposition.
     */
    data: XOR<PageCompositionCreateInput, PageCompositionUncheckedCreateInput>
  }

  /**
   * PageComposition createMany
   */
  export type PageCompositionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PageCompositions.
     */
    data: PageCompositionCreateManyInput | PageCompositionCreateManyInput[]
  }

  /**
   * PageComposition createManyAndReturn
   */
  export type PageCompositionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageComposition
     */
    select?: PageCompositionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PageCompositions.
     */
    data: PageCompositionCreateManyInput | PageCompositionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageCompositionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PageComposition update
   */
  export type PageCompositionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageComposition
     */
    select?: PageCompositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageCompositionInclude<ExtArgs> | null
    /**
     * The data needed to update a PageComposition.
     */
    data: XOR<PageCompositionUpdateInput, PageCompositionUncheckedUpdateInput>
    /**
     * Choose, which PageComposition to update.
     */
    where: PageCompositionWhereUniqueInput
  }

  /**
   * PageComposition updateMany
   */
  export type PageCompositionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PageCompositions.
     */
    data: XOR<PageCompositionUpdateManyMutationInput, PageCompositionUncheckedUpdateManyInput>
    /**
     * Filter which PageCompositions to update
     */
    where?: PageCompositionWhereInput
  }

  /**
   * PageComposition upsert
   */
  export type PageCompositionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageComposition
     */
    select?: PageCompositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageCompositionInclude<ExtArgs> | null
    /**
     * The filter to search for the PageComposition to update in case it exists.
     */
    where: PageCompositionWhereUniqueInput
    /**
     * In case the PageComposition found by the `where` argument doesn't exist, create a new PageComposition with this data.
     */
    create: XOR<PageCompositionCreateInput, PageCompositionUncheckedCreateInput>
    /**
     * In case the PageComposition was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PageCompositionUpdateInput, PageCompositionUncheckedUpdateInput>
  }

  /**
   * PageComposition delete
   */
  export type PageCompositionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageComposition
     */
    select?: PageCompositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageCompositionInclude<ExtArgs> | null
    /**
     * Filter which PageComposition to delete.
     */
    where: PageCompositionWhereUniqueInput
  }

  /**
   * PageComposition deleteMany
   */
  export type PageCompositionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PageCompositions to delete
     */
    where?: PageCompositionWhereInput
  }

  /**
   * PageComposition without action
   */
  export type PageCompositionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PageComposition
     */
    select?: PageCompositionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PageCompositionInclude<ExtArgs> | null
  }


  /**
   * Model DataEntity
   */

  export type AggregateDataEntity = {
    _count: DataEntityCountAggregateOutputType | null
    _min: DataEntityMinAggregateOutputType | null
    _max: DataEntityMaxAggregateOutputType | null
  }

  export type DataEntityMinAggregateOutputType = {
    id: string | null
    storeId: string | null
    entityType: string | null
    entityKey: string | null
    payloadJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DataEntityMaxAggregateOutputType = {
    id: string | null
    storeId: string | null
    entityType: string | null
    entityKey: string | null
    payloadJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DataEntityCountAggregateOutputType = {
    id: number
    storeId: number
    entityType: number
    entityKey: number
    payloadJson: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DataEntityMinAggregateInputType = {
    id?: true
    storeId?: true
    entityType?: true
    entityKey?: true
    payloadJson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DataEntityMaxAggregateInputType = {
    id?: true
    storeId?: true
    entityType?: true
    entityKey?: true
    payloadJson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DataEntityCountAggregateInputType = {
    id?: true
    storeId?: true
    entityType?: true
    entityKey?: true
    payloadJson?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DataEntityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DataEntity to aggregate.
     */
    where?: DataEntityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataEntities to fetch.
     */
    orderBy?: DataEntityOrderByWithRelationInput | DataEntityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DataEntityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataEntities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataEntities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DataEntities
    **/
    _count?: true | DataEntityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DataEntityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DataEntityMaxAggregateInputType
  }

  export type GetDataEntityAggregateType<T extends DataEntityAggregateArgs> = {
        [P in keyof T & keyof AggregateDataEntity]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDataEntity[P]>
      : GetScalarType<T[P], AggregateDataEntity[P]>
  }




  export type DataEntityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DataEntityWhereInput
    orderBy?: DataEntityOrderByWithAggregationInput | DataEntityOrderByWithAggregationInput[]
    by: DataEntityScalarFieldEnum[] | DataEntityScalarFieldEnum
    having?: DataEntityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DataEntityCountAggregateInputType | true
    _min?: DataEntityMinAggregateInputType
    _max?: DataEntityMaxAggregateInputType
  }

  export type DataEntityGroupByOutputType = {
    id: string
    storeId: string
    entityType: string
    entityKey: string | null
    payloadJson: string
    createdAt: Date
    updatedAt: Date
    _count: DataEntityCountAggregateOutputType | null
    _min: DataEntityMinAggregateOutputType | null
    _max: DataEntityMaxAggregateOutputType | null
  }

  type GetDataEntityGroupByPayload<T extends DataEntityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DataEntityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DataEntityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DataEntityGroupByOutputType[P]>
            : GetScalarType<T[P], DataEntityGroupByOutputType[P]>
        }
      >
    >


  export type DataEntitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    storeId?: boolean
    entityType?: boolean
    entityKey?: boolean
    payloadJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dataEntity"]>

  export type DataEntitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    storeId?: boolean
    entityType?: boolean
    entityKey?: boolean
    payloadJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dataEntity"]>

  export type DataEntitySelectScalar = {
    id?: boolean
    storeId?: boolean
    entityType?: boolean
    entityKey?: boolean
    payloadJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DataEntityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }
  export type DataEntityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }

  export type $DataEntityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DataEntity"
    objects: {
      store: Prisma.$StorePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      storeId: string
      entityType: string
      entityKey: string | null
      payloadJson: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["dataEntity"]>
    composites: {}
  }

  type DataEntityGetPayload<S extends boolean | null | undefined | DataEntityDefaultArgs> = $Result.GetResult<Prisma.$DataEntityPayload, S>

  type DataEntityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DataEntityFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DataEntityCountAggregateInputType | true
    }

  export interface DataEntityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DataEntity'], meta: { name: 'DataEntity' } }
    /**
     * Find zero or one DataEntity that matches the filter.
     * @param {DataEntityFindUniqueArgs} args - Arguments to find a DataEntity
     * @example
     * // Get one DataEntity
     * const dataEntity = await prisma.dataEntity.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DataEntityFindUniqueArgs>(args: SelectSubset<T, DataEntityFindUniqueArgs<ExtArgs>>): Prisma__DataEntityClient<$Result.GetResult<Prisma.$DataEntityPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DataEntity that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DataEntityFindUniqueOrThrowArgs} args - Arguments to find a DataEntity
     * @example
     * // Get one DataEntity
     * const dataEntity = await prisma.dataEntity.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DataEntityFindUniqueOrThrowArgs>(args: SelectSubset<T, DataEntityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DataEntityClient<$Result.GetResult<Prisma.$DataEntityPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DataEntity that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataEntityFindFirstArgs} args - Arguments to find a DataEntity
     * @example
     * // Get one DataEntity
     * const dataEntity = await prisma.dataEntity.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DataEntityFindFirstArgs>(args?: SelectSubset<T, DataEntityFindFirstArgs<ExtArgs>>): Prisma__DataEntityClient<$Result.GetResult<Prisma.$DataEntityPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DataEntity that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataEntityFindFirstOrThrowArgs} args - Arguments to find a DataEntity
     * @example
     * // Get one DataEntity
     * const dataEntity = await prisma.dataEntity.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DataEntityFindFirstOrThrowArgs>(args?: SelectSubset<T, DataEntityFindFirstOrThrowArgs<ExtArgs>>): Prisma__DataEntityClient<$Result.GetResult<Prisma.$DataEntityPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DataEntities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataEntityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DataEntities
     * const dataEntities = await prisma.dataEntity.findMany()
     * 
     * // Get first 10 DataEntities
     * const dataEntities = await prisma.dataEntity.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dataEntityWithIdOnly = await prisma.dataEntity.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DataEntityFindManyArgs>(args?: SelectSubset<T, DataEntityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataEntityPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DataEntity.
     * @param {DataEntityCreateArgs} args - Arguments to create a DataEntity.
     * @example
     * // Create one DataEntity
     * const DataEntity = await prisma.dataEntity.create({
     *   data: {
     *     // ... data to create a DataEntity
     *   }
     * })
     * 
     */
    create<T extends DataEntityCreateArgs>(args: SelectSubset<T, DataEntityCreateArgs<ExtArgs>>): Prisma__DataEntityClient<$Result.GetResult<Prisma.$DataEntityPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DataEntities.
     * @param {DataEntityCreateManyArgs} args - Arguments to create many DataEntities.
     * @example
     * // Create many DataEntities
     * const dataEntity = await prisma.dataEntity.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DataEntityCreateManyArgs>(args?: SelectSubset<T, DataEntityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DataEntities and returns the data saved in the database.
     * @param {DataEntityCreateManyAndReturnArgs} args - Arguments to create many DataEntities.
     * @example
     * // Create many DataEntities
     * const dataEntity = await prisma.dataEntity.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DataEntities and only return the `id`
     * const dataEntityWithIdOnly = await prisma.dataEntity.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DataEntityCreateManyAndReturnArgs>(args?: SelectSubset<T, DataEntityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataEntityPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DataEntity.
     * @param {DataEntityDeleteArgs} args - Arguments to delete one DataEntity.
     * @example
     * // Delete one DataEntity
     * const DataEntity = await prisma.dataEntity.delete({
     *   where: {
     *     // ... filter to delete one DataEntity
     *   }
     * })
     * 
     */
    delete<T extends DataEntityDeleteArgs>(args: SelectSubset<T, DataEntityDeleteArgs<ExtArgs>>): Prisma__DataEntityClient<$Result.GetResult<Prisma.$DataEntityPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DataEntity.
     * @param {DataEntityUpdateArgs} args - Arguments to update one DataEntity.
     * @example
     * // Update one DataEntity
     * const dataEntity = await prisma.dataEntity.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DataEntityUpdateArgs>(args: SelectSubset<T, DataEntityUpdateArgs<ExtArgs>>): Prisma__DataEntityClient<$Result.GetResult<Prisma.$DataEntityPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DataEntities.
     * @param {DataEntityDeleteManyArgs} args - Arguments to filter DataEntities to delete.
     * @example
     * // Delete a few DataEntities
     * const { count } = await prisma.dataEntity.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DataEntityDeleteManyArgs>(args?: SelectSubset<T, DataEntityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DataEntities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataEntityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DataEntities
     * const dataEntity = await prisma.dataEntity.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DataEntityUpdateManyArgs>(args: SelectSubset<T, DataEntityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DataEntity.
     * @param {DataEntityUpsertArgs} args - Arguments to update or create a DataEntity.
     * @example
     * // Update or create a DataEntity
     * const dataEntity = await prisma.dataEntity.upsert({
     *   create: {
     *     // ... data to create a DataEntity
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DataEntity we want to update
     *   }
     * })
     */
    upsert<T extends DataEntityUpsertArgs>(args: SelectSubset<T, DataEntityUpsertArgs<ExtArgs>>): Prisma__DataEntityClient<$Result.GetResult<Prisma.$DataEntityPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DataEntities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataEntityCountArgs} args - Arguments to filter DataEntities to count.
     * @example
     * // Count the number of DataEntities
     * const count = await prisma.dataEntity.count({
     *   where: {
     *     // ... the filter for the DataEntities we want to count
     *   }
     * })
    **/
    count<T extends DataEntityCountArgs>(
      args?: Subset<T, DataEntityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DataEntityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DataEntity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataEntityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DataEntityAggregateArgs>(args: Subset<T, DataEntityAggregateArgs>): Prisma.PrismaPromise<GetDataEntityAggregateType<T>>

    /**
     * Group by DataEntity.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataEntityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DataEntityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DataEntityGroupByArgs['orderBy'] }
        : { orderBy?: DataEntityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DataEntityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDataEntityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DataEntity model
   */
  readonly fields: DataEntityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DataEntity.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DataEntityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    store<T extends StoreDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StoreDefaultArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DataEntity model
   */ 
  interface DataEntityFieldRefs {
    readonly id: FieldRef<"DataEntity", 'String'>
    readonly storeId: FieldRef<"DataEntity", 'String'>
    readonly entityType: FieldRef<"DataEntity", 'String'>
    readonly entityKey: FieldRef<"DataEntity", 'String'>
    readonly payloadJson: FieldRef<"DataEntity", 'String'>
    readonly createdAt: FieldRef<"DataEntity", 'DateTime'>
    readonly updatedAt: FieldRef<"DataEntity", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DataEntity findUnique
   */
  export type DataEntityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataEntity
     */
    select?: DataEntitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataEntityInclude<ExtArgs> | null
    /**
     * Filter, which DataEntity to fetch.
     */
    where: DataEntityWhereUniqueInput
  }

  /**
   * DataEntity findUniqueOrThrow
   */
  export type DataEntityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataEntity
     */
    select?: DataEntitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataEntityInclude<ExtArgs> | null
    /**
     * Filter, which DataEntity to fetch.
     */
    where: DataEntityWhereUniqueInput
  }

  /**
   * DataEntity findFirst
   */
  export type DataEntityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataEntity
     */
    select?: DataEntitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataEntityInclude<ExtArgs> | null
    /**
     * Filter, which DataEntity to fetch.
     */
    where?: DataEntityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataEntities to fetch.
     */
    orderBy?: DataEntityOrderByWithRelationInput | DataEntityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DataEntities.
     */
    cursor?: DataEntityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataEntities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataEntities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DataEntities.
     */
    distinct?: DataEntityScalarFieldEnum | DataEntityScalarFieldEnum[]
  }

  /**
   * DataEntity findFirstOrThrow
   */
  export type DataEntityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataEntity
     */
    select?: DataEntitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataEntityInclude<ExtArgs> | null
    /**
     * Filter, which DataEntity to fetch.
     */
    where?: DataEntityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataEntities to fetch.
     */
    orderBy?: DataEntityOrderByWithRelationInput | DataEntityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DataEntities.
     */
    cursor?: DataEntityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataEntities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataEntities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DataEntities.
     */
    distinct?: DataEntityScalarFieldEnum | DataEntityScalarFieldEnum[]
  }

  /**
   * DataEntity findMany
   */
  export type DataEntityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataEntity
     */
    select?: DataEntitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataEntityInclude<ExtArgs> | null
    /**
     * Filter, which DataEntities to fetch.
     */
    where?: DataEntityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataEntities to fetch.
     */
    orderBy?: DataEntityOrderByWithRelationInput | DataEntityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DataEntities.
     */
    cursor?: DataEntityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataEntities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataEntities.
     */
    skip?: number
    distinct?: DataEntityScalarFieldEnum | DataEntityScalarFieldEnum[]
  }

  /**
   * DataEntity create
   */
  export type DataEntityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataEntity
     */
    select?: DataEntitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataEntityInclude<ExtArgs> | null
    /**
     * The data needed to create a DataEntity.
     */
    data: XOR<DataEntityCreateInput, DataEntityUncheckedCreateInput>
  }

  /**
   * DataEntity createMany
   */
  export type DataEntityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DataEntities.
     */
    data: DataEntityCreateManyInput | DataEntityCreateManyInput[]
  }

  /**
   * DataEntity createManyAndReturn
   */
  export type DataEntityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataEntity
     */
    select?: DataEntitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DataEntities.
     */
    data: DataEntityCreateManyInput | DataEntityCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataEntityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DataEntity update
   */
  export type DataEntityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataEntity
     */
    select?: DataEntitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataEntityInclude<ExtArgs> | null
    /**
     * The data needed to update a DataEntity.
     */
    data: XOR<DataEntityUpdateInput, DataEntityUncheckedUpdateInput>
    /**
     * Choose, which DataEntity to update.
     */
    where: DataEntityWhereUniqueInput
  }

  /**
   * DataEntity updateMany
   */
  export type DataEntityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DataEntities.
     */
    data: XOR<DataEntityUpdateManyMutationInput, DataEntityUncheckedUpdateManyInput>
    /**
     * Filter which DataEntities to update
     */
    where?: DataEntityWhereInput
  }

  /**
   * DataEntity upsert
   */
  export type DataEntityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataEntity
     */
    select?: DataEntitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataEntityInclude<ExtArgs> | null
    /**
     * The filter to search for the DataEntity to update in case it exists.
     */
    where: DataEntityWhereUniqueInput
    /**
     * In case the DataEntity found by the `where` argument doesn't exist, create a new DataEntity with this data.
     */
    create: XOR<DataEntityCreateInput, DataEntityUncheckedCreateInput>
    /**
     * In case the DataEntity was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DataEntityUpdateInput, DataEntityUncheckedUpdateInput>
  }

  /**
   * DataEntity delete
   */
  export type DataEntityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataEntity
     */
    select?: DataEntitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataEntityInclude<ExtArgs> | null
    /**
     * Filter which DataEntity to delete.
     */
    where: DataEntityWhereUniqueInput
  }

  /**
   * DataEntity deleteMany
   */
  export type DataEntityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DataEntities to delete
     */
    where?: DataEntityWhereInput
  }

  /**
   * DataEntity without action
   */
  export type DataEntityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataEntity
     */
    select?: DataEntitySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataEntityInclude<ExtArgs> | null
  }


  /**
   * Model Collection
   */

  export type AggregateCollection = {
    _count: CollectionCountAggregateOutputType | null
    _min: CollectionMinAggregateOutputType | null
    _max: CollectionMaxAggregateOutputType | null
  }

  export type CollectionMinAggregateOutputType = {
    id: string | null
    storeId: string | null
    name: string | null
    source: string | null
    rulesJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CollectionMaxAggregateOutputType = {
    id: string | null
    storeId: string | null
    name: string | null
    source: string | null
    rulesJson: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CollectionCountAggregateOutputType = {
    id: number
    storeId: number
    name: number
    source: number
    rulesJson: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CollectionMinAggregateInputType = {
    id?: true
    storeId?: true
    name?: true
    source?: true
    rulesJson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CollectionMaxAggregateInputType = {
    id?: true
    storeId?: true
    name?: true
    source?: true
    rulesJson?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CollectionCountAggregateInputType = {
    id?: true
    storeId?: true
    name?: true
    source?: true
    rulesJson?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CollectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Collection to aggregate.
     */
    where?: CollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Collections to fetch.
     */
    orderBy?: CollectionOrderByWithRelationInput | CollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Collections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Collections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Collections
    **/
    _count?: true | CollectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CollectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CollectionMaxAggregateInputType
  }

  export type GetCollectionAggregateType<T extends CollectionAggregateArgs> = {
        [P in keyof T & keyof AggregateCollection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCollection[P]>
      : GetScalarType<T[P], AggregateCollection[P]>
  }




  export type CollectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CollectionWhereInput
    orderBy?: CollectionOrderByWithAggregationInput | CollectionOrderByWithAggregationInput[]
    by: CollectionScalarFieldEnum[] | CollectionScalarFieldEnum
    having?: CollectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CollectionCountAggregateInputType | true
    _min?: CollectionMinAggregateInputType
    _max?: CollectionMaxAggregateInputType
  }

  export type CollectionGroupByOutputType = {
    id: string
    storeId: string
    name: string
    source: string
    rulesJson: string | null
    createdAt: Date
    updatedAt: Date
    _count: CollectionCountAggregateOutputType | null
    _min: CollectionMinAggregateOutputType | null
    _max: CollectionMaxAggregateOutputType | null
  }

  type GetCollectionGroupByPayload<T extends CollectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CollectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CollectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CollectionGroupByOutputType[P]>
            : GetScalarType<T[P], CollectionGroupByOutputType[P]>
        }
      >
    >


  export type CollectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    storeId?: boolean
    name?: boolean
    source?: boolean
    rulesJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    store?: boolean | StoreDefaultArgs<ExtArgs>
    items?: boolean | Collection$itemsArgs<ExtArgs>
    _count?: boolean | CollectionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["collection"]>

  export type CollectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    storeId?: boolean
    name?: boolean
    source?: boolean
    rulesJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["collection"]>

  export type CollectionSelectScalar = {
    id?: boolean
    storeId?: boolean
    name?: boolean
    source?: boolean
    rulesJson?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CollectionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    store?: boolean | StoreDefaultArgs<ExtArgs>
    items?: boolean | Collection$itemsArgs<ExtArgs>
    _count?: boolean | CollectionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CollectionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }

  export type $CollectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Collection"
    objects: {
      store: Prisma.$StorePayload<ExtArgs>
      items: Prisma.$CollectionItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      storeId: string
      name: string
      source: string
      rulesJson: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["collection"]>
    composites: {}
  }

  type CollectionGetPayload<S extends boolean | null | undefined | CollectionDefaultArgs> = $Result.GetResult<Prisma.$CollectionPayload, S>

  type CollectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CollectionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CollectionCountAggregateInputType | true
    }

  export interface CollectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Collection'], meta: { name: 'Collection' } }
    /**
     * Find zero or one Collection that matches the filter.
     * @param {CollectionFindUniqueArgs} args - Arguments to find a Collection
     * @example
     * // Get one Collection
     * const collection = await prisma.collection.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CollectionFindUniqueArgs>(args: SelectSubset<T, CollectionFindUniqueArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Collection that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CollectionFindUniqueOrThrowArgs} args - Arguments to find a Collection
     * @example
     * // Get one Collection
     * const collection = await prisma.collection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CollectionFindUniqueOrThrowArgs>(args: SelectSubset<T, CollectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Collection that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionFindFirstArgs} args - Arguments to find a Collection
     * @example
     * // Get one Collection
     * const collection = await prisma.collection.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CollectionFindFirstArgs>(args?: SelectSubset<T, CollectionFindFirstArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Collection that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionFindFirstOrThrowArgs} args - Arguments to find a Collection
     * @example
     * // Get one Collection
     * const collection = await prisma.collection.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CollectionFindFirstOrThrowArgs>(args?: SelectSubset<T, CollectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Collections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Collections
     * const collections = await prisma.collection.findMany()
     * 
     * // Get first 10 Collections
     * const collections = await prisma.collection.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const collectionWithIdOnly = await prisma.collection.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CollectionFindManyArgs>(args?: SelectSubset<T, CollectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Collection.
     * @param {CollectionCreateArgs} args - Arguments to create a Collection.
     * @example
     * // Create one Collection
     * const Collection = await prisma.collection.create({
     *   data: {
     *     // ... data to create a Collection
     *   }
     * })
     * 
     */
    create<T extends CollectionCreateArgs>(args: SelectSubset<T, CollectionCreateArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Collections.
     * @param {CollectionCreateManyArgs} args - Arguments to create many Collections.
     * @example
     * // Create many Collections
     * const collection = await prisma.collection.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CollectionCreateManyArgs>(args?: SelectSubset<T, CollectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Collections and returns the data saved in the database.
     * @param {CollectionCreateManyAndReturnArgs} args - Arguments to create many Collections.
     * @example
     * // Create many Collections
     * const collection = await prisma.collection.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Collections and only return the `id`
     * const collectionWithIdOnly = await prisma.collection.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CollectionCreateManyAndReturnArgs>(args?: SelectSubset<T, CollectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Collection.
     * @param {CollectionDeleteArgs} args - Arguments to delete one Collection.
     * @example
     * // Delete one Collection
     * const Collection = await prisma.collection.delete({
     *   where: {
     *     // ... filter to delete one Collection
     *   }
     * })
     * 
     */
    delete<T extends CollectionDeleteArgs>(args: SelectSubset<T, CollectionDeleteArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Collection.
     * @param {CollectionUpdateArgs} args - Arguments to update one Collection.
     * @example
     * // Update one Collection
     * const collection = await prisma.collection.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CollectionUpdateArgs>(args: SelectSubset<T, CollectionUpdateArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Collections.
     * @param {CollectionDeleteManyArgs} args - Arguments to filter Collections to delete.
     * @example
     * // Delete a few Collections
     * const { count } = await prisma.collection.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CollectionDeleteManyArgs>(args?: SelectSubset<T, CollectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Collections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Collections
     * const collection = await prisma.collection.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CollectionUpdateManyArgs>(args: SelectSubset<T, CollectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Collection.
     * @param {CollectionUpsertArgs} args - Arguments to update or create a Collection.
     * @example
     * // Update or create a Collection
     * const collection = await prisma.collection.upsert({
     *   create: {
     *     // ... data to create a Collection
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Collection we want to update
     *   }
     * })
     */
    upsert<T extends CollectionUpsertArgs>(args: SelectSubset<T, CollectionUpsertArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Collections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionCountArgs} args - Arguments to filter Collections to count.
     * @example
     * // Count the number of Collections
     * const count = await prisma.collection.count({
     *   where: {
     *     // ... the filter for the Collections we want to count
     *   }
     * })
    **/
    count<T extends CollectionCountArgs>(
      args?: Subset<T, CollectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CollectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Collection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CollectionAggregateArgs>(args: Subset<T, CollectionAggregateArgs>): Prisma.PrismaPromise<GetCollectionAggregateType<T>>

    /**
     * Group by Collection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CollectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CollectionGroupByArgs['orderBy'] }
        : { orderBy?: CollectionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CollectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCollectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Collection model
   */
  readonly fields: CollectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Collection.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CollectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    store<T extends StoreDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StoreDefaultArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    items<T extends Collection$itemsArgs<ExtArgs> = {}>(args?: Subset<T, Collection$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectionItemPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Collection model
   */ 
  interface CollectionFieldRefs {
    readonly id: FieldRef<"Collection", 'String'>
    readonly storeId: FieldRef<"Collection", 'String'>
    readonly name: FieldRef<"Collection", 'String'>
    readonly source: FieldRef<"Collection", 'String'>
    readonly rulesJson: FieldRef<"Collection", 'String'>
    readonly createdAt: FieldRef<"Collection", 'DateTime'>
    readonly updatedAt: FieldRef<"Collection", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Collection findUnique
   */
  export type CollectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * Filter, which Collection to fetch.
     */
    where: CollectionWhereUniqueInput
  }

  /**
   * Collection findUniqueOrThrow
   */
  export type CollectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * Filter, which Collection to fetch.
     */
    where: CollectionWhereUniqueInput
  }

  /**
   * Collection findFirst
   */
  export type CollectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * Filter, which Collection to fetch.
     */
    where?: CollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Collections to fetch.
     */
    orderBy?: CollectionOrderByWithRelationInput | CollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Collections.
     */
    cursor?: CollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Collections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Collections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Collections.
     */
    distinct?: CollectionScalarFieldEnum | CollectionScalarFieldEnum[]
  }

  /**
   * Collection findFirstOrThrow
   */
  export type CollectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * Filter, which Collection to fetch.
     */
    where?: CollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Collections to fetch.
     */
    orderBy?: CollectionOrderByWithRelationInput | CollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Collections.
     */
    cursor?: CollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Collections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Collections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Collections.
     */
    distinct?: CollectionScalarFieldEnum | CollectionScalarFieldEnum[]
  }

  /**
   * Collection findMany
   */
  export type CollectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * Filter, which Collections to fetch.
     */
    where?: CollectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Collections to fetch.
     */
    orderBy?: CollectionOrderByWithRelationInput | CollectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Collections.
     */
    cursor?: CollectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Collections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Collections.
     */
    skip?: number
    distinct?: CollectionScalarFieldEnum | CollectionScalarFieldEnum[]
  }

  /**
   * Collection create
   */
  export type CollectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * The data needed to create a Collection.
     */
    data: XOR<CollectionCreateInput, CollectionUncheckedCreateInput>
  }

  /**
   * Collection createMany
   */
  export type CollectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Collections.
     */
    data: CollectionCreateManyInput | CollectionCreateManyInput[]
  }

  /**
   * Collection createManyAndReturn
   */
  export type CollectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Collections.
     */
    data: CollectionCreateManyInput | CollectionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Collection update
   */
  export type CollectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * The data needed to update a Collection.
     */
    data: XOR<CollectionUpdateInput, CollectionUncheckedUpdateInput>
    /**
     * Choose, which Collection to update.
     */
    where: CollectionWhereUniqueInput
  }

  /**
   * Collection updateMany
   */
  export type CollectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Collections.
     */
    data: XOR<CollectionUpdateManyMutationInput, CollectionUncheckedUpdateManyInput>
    /**
     * Filter which Collections to update
     */
    where?: CollectionWhereInput
  }

  /**
   * Collection upsert
   */
  export type CollectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * The filter to search for the Collection to update in case it exists.
     */
    where: CollectionWhereUniqueInput
    /**
     * In case the Collection found by the `where` argument doesn't exist, create a new Collection with this data.
     */
    create: XOR<CollectionCreateInput, CollectionUncheckedCreateInput>
    /**
     * In case the Collection was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CollectionUpdateInput, CollectionUncheckedUpdateInput>
  }

  /**
   * Collection delete
   */
  export type CollectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
    /**
     * Filter which Collection to delete.
     */
    where: CollectionWhereUniqueInput
  }

  /**
   * Collection deleteMany
   */
  export type CollectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Collections to delete
     */
    where?: CollectionWhereInput
  }

  /**
   * Collection.items
   */
  export type Collection$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionItem
     */
    select?: CollectionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionItemInclude<ExtArgs> | null
    where?: CollectionItemWhereInput
    orderBy?: CollectionItemOrderByWithRelationInput | CollectionItemOrderByWithRelationInput[]
    cursor?: CollectionItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CollectionItemScalarFieldEnum | CollectionItemScalarFieldEnum[]
  }

  /**
   * Collection without action
   */
  export type CollectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collection
     */
    select?: CollectionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionInclude<ExtArgs> | null
  }


  /**
   * Model CollectionItem
   */

  export type AggregateCollectionItem = {
    _count: CollectionItemCountAggregateOutputType | null
    _avg: CollectionItemAvgAggregateOutputType | null
    _sum: CollectionItemSumAggregateOutputType | null
    _min: CollectionItemMinAggregateOutputType | null
    _max: CollectionItemMaxAggregateOutputType | null
  }

  export type CollectionItemAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type CollectionItemSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type CollectionItemMinAggregateOutputType = {
    collectionId: string | null
    entityId: string | null
    sortOrder: number | null
  }

  export type CollectionItemMaxAggregateOutputType = {
    collectionId: string | null
    entityId: string | null
    sortOrder: number | null
  }

  export type CollectionItemCountAggregateOutputType = {
    collectionId: number
    entityId: number
    sortOrder: number
    _all: number
  }


  export type CollectionItemAvgAggregateInputType = {
    sortOrder?: true
  }

  export type CollectionItemSumAggregateInputType = {
    sortOrder?: true
  }

  export type CollectionItemMinAggregateInputType = {
    collectionId?: true
    entityId?: true
    sortOrder?: true
  }

  export type CollectionItemMaxAggregateInputType = {
    collectionId?: true
    entityId?: true
    sortOrder?: true
  }

  export type CollectionItemCountAggregateInputType = {
    collectionId?: true
    entityId?: true
    sortOrder?: true
    _all?: true
  }

  export type CollectionItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CollectionItem to aggregate.
     */
    where?: CollectionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CollectionItems to fetch.
     */
    orderBy?: CollectionItemOrderByWithRelationInput | CollectionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CollectionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CollectionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CollectionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CollectionItems
    **/
    _count?: true | CollectionItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CollectionItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CollectionItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CollectionItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CollectionItemMaxAggregateInputType
  }

  export type GetCollectionItemAggregateType<T extends CollectionItemAggregateArgs> = {
        [P in keyof T & keyof AggregateCollectionItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCollectionItem[P]>
      : GetScalarType<T[P], AggregateCollectionItem[P]>
  }




  export type CollectionItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CollectionItemWhereInput
    orderBy?: CollectionItemOrderByWithAggregationInput | CollectionItemOrderByWithAggregationInput[]
    by: CollectionItemScalarFieldEnum[] | CollectionItemScalarFieldEnum
    having?: CollectionItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CollectionItemCountAggregateInputType | true
    _avg?: CollectionItemAvgAggregateInputType
    _sum?: CollectionItemSumAggregateInputType
    _min?: CollectionItemMinAggregateInputType
    _max?: CollectionItemMaxAggregateInputType
  }

  export type CollectionItemGroupByOutputType = {
    collectionId: string
    entityId: string
    sortOrder: number
    _count: CollectionItemCountAggregateOutputType | null
    _avg: CollectionItemAvgAggregateOutputType | null
    _sum: CollectionItemSumAggregateOutputType | null
    _min: CollectionItemMinAggregateOutputType | null
    _max: CollectionItemMaxAggregateOutputType | null
  }

  type GetCollectionItemGroupByPayload<T extends CollectionItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CollectionItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CollectionItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CollectionItemGroupByOutputType[P]>
            : GetScalarType<T[P], CollectionItemGroupByOutputType[P]>
        }
      >
    >


  export type CollectionItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    collectionId?: boolean
    entityId?: boolean
    sortOrder?: boolean
    collection?: boolean | CollectionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["collectionItem"]>

  export type CollectionItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    collectionId?: boolean
    entityId?: boolean
    sortOrder?: boolean
    collection?: boolean | CollectionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["collectionItem"]>

  export type CollectionItemSelectScalar = {
    collectionId?: boolean
    entityId?: boolean
    sortOrder?: boolean
  }

  export type CollectionItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    collection?: boolean | CollectionDefaultArgs<ExtArgs>
  }
  export type CollectionItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    collection?: boolean | CollectionDefaultArgs<ExtArgs>
  }

  export type $CollectionItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CollectionItem"
    objects: {
      collection: Prisma.$CollectionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      collectionId: string
      entityId: string
      sortOrder: number
    }, ExtArgs["result"]["collectionItem"]>
    composites: {}
  }

  type CollectionItemGetPayload<S extends boolean | null | undefined | CollectionItemDefaultArgs> = $Result.GetResult<Prisma.$CollectionItemPayload, S>

  type CollectionItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CollectionItemFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CollectionItemCountAggregateInputType | true
    }

  export interface CollectionItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CollectionItem'], meta: { name: 'CollectionItem' } }
    /**
     * Find zero or one CollectionItem that matches the filter.
     * @param {CollectionItemFindUniqueArgs} args - Arguments to find a CollectionItem
     * @example
     * // Get one CollectionItem
     * const collectionItem = await prisma.collectionItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CollectionItemFindUniqueArgs>(args: SelectSubset<T, CollectionItemFindUniqueArgs<ExtArgs>>): Prisma__CollectionItemClient<$Result.GetResult<Prisma.$CollectionItemPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CollectionItem that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CollectionItemFindUniqueOrThrowArgs} args - Arguments to find a CollectionItem
     * @example
     * // Get one CollectionItem
     * const collectionItem = await prisma.collectionItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CollectionItemFindUniqueOrThrowArgs>(args: SelectSubset<T, CollectionItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CollectionItemClient<$Result.GetResult<Prisma.$CollectionItemPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CollectionItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionItemFindFirstArgs} args - Arguments to find a CollectionItem
     * @example
     * // Get one CollectionItem
     * const collectionItem = await prisma.collectionItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CollectionItemFindFirstArgs>(args?: SelectSubset<T, CollectionItemFindFirstArgs<ExtArgs>>): Prisma__CollectionItemClient<$Result.GetResult<Prisma.$CollectionItemPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CollectionItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionItemFindFirstOrThrowArgs} args - Arguments to find a CollectionItem
     * @example
     * // Get one CollectionItem
     * const collectionItem = await prisma.collectionItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CollectionItemFindFirstOrThrowArgs>(args?: SelectSubset<T, CollectionItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__CollectionItemClient<$Result.GetResult<Prisma.$CollectionItemPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CollectionItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CollectionItems
     * const collectionItems = await prisma.collectionItem.findMany()
     * 
     * // Get first 10 CollectionItems
     * const collectionItems = await prisma.collectionItem.findMany({ take: 10 })
     * 
     * // Only select the `collectionId`
     * const collectionItemWithCollectionIdOnly = await prisma.collectionItem.findMany({ select: { collectionId: true } })
     * 
     */
    findMany<T extends CollectionItemFindManyArgs>(args?: SelectSubset<T, CollectionItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectionItemPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CollectionItem.
     * @param {CollectionItemCreateArgs} args - Arguments to create a CollectionItem.
     * @example
     * // Create one CollectionItem
     * const CollectionItem = await prisma.collectionItem.create({
     *   data: {
     *     // ... data to create a CollectionItem
     *   }
     * })
     * 
     */
    create<T extends CollectionItemCreateArgs>(args: SelectSubset<T, CollectionItemCreateArgs<ExtArgs>>): Prisma__CollectionItemClient<$Result.GetResult<Prisma.$CollectionItemPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CollectionItems.
     * @param {CollectionItemCreateManyArgs} args - Arguments to create many CollectionItems.
     * @example
     * // Create many CollectionItems
     * const collectionItem = await prisma.collectionItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CollectionItemCreateManyArgs>(args?: SelectSubset<T, CollectionItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CollectionItems and returns the data saved in the database.
     * @param {CollectionItemCreateManyAndReturnArgs} args - Arguments to create many CollectionItems.
     * @example
     * // Create many CollectionItems
     * const collectionItem = await prisma.collectionItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CollectionItems and only return the `collectionId`
     * const collectionItemWithCollectionIdOnly = await prisma.collectionItem.createManyAndReturn({ 
     *   select: { collectionId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CollectionItemCreateManyAndReturnArgs>(args?: SelectSubset<T, CollectionItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollectionItemPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CollectionItem.
     * @param {CollectionItemDeleteArgs} args - Arguments to delete one CollectionItem.
     * @example
     * // Delete one CollectionItem
     * const CollectionItem = await prisma.collectionItem.delete({
     *   where: {
     *     // ... filter to delete one CollectionItem
     *   }
     * })
     * 
     */
    delete<T extends CollectionItemDeleteArgs>(args: SelectSubset<T, CollectionItemDeleteArgs<ExtArgs>>): Prisma__CollectionItemClient<$Result.GetResult<Prisma.$CollectionItemPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CollectionItem.
     * @param {CollectionItemUpdateArgs} args - Arguments to update one CollectionItem.
     * @example
     * // Update one CollectionItem
     * const collectionItem = await prisma.collectionItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CollectionItemUpdateArgs>(args: SelectSubset<T, CollectionItemUpdateArgs<ExtArgs>>): Prisma__CollectionItemClient<$Result.GetResult<Prisma.$CollectionItemPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CollectionItems.
     * @param {CollectionItemDeleteManyArgs} args - Arguments to filter CollectionItems to delete.
     * @example
     * // Delete a few CollectionItems
     * const { count } = await prisma.collectionItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CollectionItemDeleteManyArgs>(args?: SelectSubset<T, CollectionItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CollectionItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CollectionItems
     * const collectionItem = await prisma.collectionItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CollectionItemUpdateManyArgs>(args: SelectSubset<T, CollectionItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CollectionItem.
     * @param {CollectionItemUpsertArgs} args - Arguments to update or create a CollectionItem.
     * @example
     * // Update or create a CollectionItem
     * const collectionItem = await prisma.collectionItem.upsert({
     *   create: {
     *     // ... data to create a CollectionItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CollectionItem we want to update
     *   }
     * })
     */
    upsert<T extends CollectionItemUpsertArgs>(args: SelectSubset<T, CollectionItemUpsertArgs<ExtArgs>>): Prisma__CollectionItemClient<$Result.GetResult<Prisma.$CollectionItemPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CollectionItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionItemCountArgs} args - Arguments to filter CollectionItems to count.
     * @example
     * // Count the number of CollectionItems
     * const count = await prisma.collectionItem.count({
     *   where: {
     *     // ... the filter for the CollectionItems we want to count
     *   }
     * })
    **/
    count<T extends CollectionItemCountArgs>(
      args?: Subset<T, CollectionItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CollectionItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CollectionItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CollectionItemAggregateArgs>(args: Subset<T, CollectionItemAggregateArgs>): Prisma.PrismaPromise<GetCollectionItemAggregateType<T>>

    /**
     * Group by CollectionItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollectionItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CollectionItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CollectionItemGroupByArgs['orderBy'] }
        : { orderBy?: CollectionItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CollectionItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCollectionItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CollectionItem model
   */
  readonly fields: CollectionItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CollectionItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CollectionItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    collection<T extends CollectionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CollectionDefaultArgs<ExtArgs>>): Prisma__CollectionClient<$Result.GetResult<Prisma.$CollectionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CollectionItem model
   */ 
  interface CollectionItemFieldRefs {
    readonly collectionId: FieldRef<"CollectionItem", 'String'>
    readonly entityId: FieldRef<"CollectionItem", 'String'>
    readonly sortOrder: FieldRef<"CollectionItem", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * CollectionItem findUnique
   */
  export type CollectionItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionItem
     */
    select?: CollectionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionItemInclude<ExtArgs> | null
    /**
     * Filter, which CollectionItem to fetch.
     */
    where: CollectionItemWhereUniqueInput
  }

  /**
   * CollectionItem findUniqueOrThrow
   */
  export type CollectionItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionItem
     */
    select?: CollectionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionItemInclude<ExtArgs> | null
    /**
     * Filter, which CollectionItem to fetch.
     */
    where: CollectionItemWhereUniqueInput
  }

  /**
   * CollectionItem findFirst
   */
  export type CollectionItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionItem
     */
    select?: CollectionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionItemInclude<ExtArgs> | null
    /**
     * Filter, which CollectionItem to fetch.
     */
    where?: CollectionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CollectionItems to fetch.
     */
    orderBy?: CollectionItemOrderByWithRelationInput | CollectionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CollectionItems.
     */
    cursor?: CollectionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CollectionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CollectionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CollectionItems.
     */
    distinct?: CollectionItemScalarFieldEnum | CollectionItemScalarFieldEnum[]
  }

  /**
   * CollectionItem findFirstOrThrow
   */
  export type CollectionItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionItem
     */
    select?: CollectionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionItemInclude<ExtArgs> | null
    /**
     * Filter, which CollectionItem to fetch.
     */
    where?: CollectionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CollectionItems to fetch.
     */
    orderBy?: CollectionItemOrderByWithRelationInput | CollectionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CollectionItems.
     */
    cursor?: CollectionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CollectionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CollectionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CollectionItems.
     */
    distinct?: CollectionItemScalarFieldEnum | CollectionItemScalarFieldEnum[]
  }

  /**
   * CollectionItem findMany
   */
  export type CollectionItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionItem
     */
    select?: CollectionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionItemInclude<ExtArgs> | null
    /**
     * Filter, which CollectionItems to fetch.
     */
    where?: CollectionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CollectionItems to fetch.
     */
    orderBy?: CollectionItemOrderByWithRelationInput | CollectionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CollectionItems.
     */
    cursor?: CollectionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CollectionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CollectionItems.
     */
    skip?: number
    distinct?: CollectionItemScalarFieldEnum | CollectionItemScalarFieldEnum[]
  }

  /**
   * CollectionItem create
   */
  export type CollectionItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionItem
     */
    select?: CollectionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionItemInclude<ExtArgs> | null
    /**
     * The data needed to create a CollectionItem.
     */
    data: XOR<CollectionItemCreateInput, CollectionItemUncheckedCreateInput>
  }

  /**
   * CollectionItem createMany
   */
  export type CollectionItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CollectionItems.
     */
    data: CollectionItemCreateManyInput | CollectionItemCreateManyInput[]
  }

  /**
   * CollectionItem createManyAndReturn
   */
  export type CollectionItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionItem
     */
    select?: CollectionItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CollectionItems.
     */
    data: CollectionItemCreateManyInput | CollectionItemCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CollectionItem update
   */
  export type CollectionItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionItem
     */
    select?: CollectionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionItemInclude<ExtArgs> | null
    /**
     * The data needed to update a CollectionItem.
     */
    data: XOR<CollectionItemUpdateInput, CollectionItemUncheckedUpdateInput>
    /**
     * Choose, which CollectionItem to update.
     */
    where: CollectionItemWhereUniqueInput
  }

  /**
   * CollectionItem updateMany
   */
  export type CollectionItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CollectionItems.
     */
    data: XOR<CollectionItemUpdateManyMutationInput, CollectionItemUncheckedUpdateManyInput>
    /**
     * Filter which CollectionItems to update
     */
    where?: CollectionItemWhereInput
  }

  /**
   * CollectionItem upsert
   */
  export type CollectionItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionItem
     */
    select?: CollectionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionItemInclude<ExtArgs> | null
    /**
     * The filter to search for the CollectionItem to update in case it exists.
     */
    where: CollectionItemWhereUniqueInput
    /**
     * In case the CollectionItem found by the `where` argument doesn't exist, create a new CollectionItem with this data.
     */
    create: XOR<CollectionItemCreateInput, CollectionItemUncheckedCreateInput>
    /**
     * In case the CollectionItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CollectionItemUpdateInput, CollectionItemUncheckedUpdateInput>
  }

  /**
   * CollectionItem delete
   */
  export type CollectionItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionItem
     */
    select?: CollectionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionItemInclude<ExtArgs> | null
    /**
     * Filter which CollectionItem to delete.
     */
    where: CollectionItemWhereUniqueInput
  }

  /**
   * CollectionItem deleteMany
   */
  export type CollectionItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CollectionItems to delete
     */
    where?: CollectionItemWhereInput
  }

  /**
   * CollectionItem without action
   */
  export type CollectionItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CollectionItem
     */
    select?: CollectionItemSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollectionItemInclude<ExtArgs> | null
  }


  /**
   * Model DataBinding
   */

  export type AggregateDataBinding = {
    _count: DataBindingCountAggregateOutputType | null
    _min: DataBindingMinAggregateOutputType | null
    _max: DataBindingMaxAggregateOutputType | null
  }

  export type DataBindingMinAggregateOutputType = {
    id: string | null
    storeId: string | null
    componentPath: string | null
    bindingKey: string | null
    sourceType: string | null
    sourceRef: string | null
    bindingJson: string | null
    updatedAt: Date | null
  }

  export type DataBindingMaxAggregateOutputType = {
    id: string | null
    storeId: string | null
    componentPath: string | null
    bindingKey: string | null
    sourceType: string | null
    sourceRef: string | null
    bindingJson: string | null
    updatedAt: Date | null
  }

  export type DataBindingCountAggregateOutputType = {
    id: number
    storeId: number
    componentPath: number
    bindingKey: number
    sourceType: number
    sourceRef: number
    bindingJson: number
    updatedAt: number
    _all: number
  }


  export type DataBindingMinAggregateInputType = {
    id?: true
    storeId?: true
    componentPath?: true
    bindingKey?: true
    sourceType?: true
    sourceRef?: true
    bindingJson?: true
    updatedAt?: true
  }

  export type DataBindingMaxAggregateInputType = {
    id?: true
    storeId?: true
    componentPath?: true
    bindingKey?: true
    sourceType?: true
    sourceRef?: true
    bindingJson?: true
    updatedAt?: true
  }

  export type DataBindingCountAggregateInputType = {
    id?: true
    storeId?: true
    componentPath?: true
    bindingKey?: true
    sourceType?: true
    sourceRef?: true
    bindingJson?: true
    updatedAt?: true
    _all?: true
  }

  export type DataBindingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DataBinding to aggregate.
     */
    where?: DataBindingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataBindings to fetch.
     */
    orderBy?: DataBindingOrderByWithRelationInput | DataBindingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DataBindingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataBindings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataBindings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DataBindings
    **/
    _count?: true | DataBindingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DataBindingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DataBindingMaxAggregateInputType
  }

  export type GetDataBindingAggregateType<T extends DataBindingAggregateArgs> = {
        [P in keyof T & keyof AggregateDataBinding]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDataBinding[P]>
      : GetScalarType<T[P], AggregateDataBinding[P]>
  }




  export type DataBindingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DataBindingWhereInput
    orderBy?: DataBindingOrderByWithAggregationInput | DataBindingOrderByWithAggregationInput[]
    by: DataBindingScalarFieldEnum[] | DataBindingScalarFieldEnum
    having?: DataBindingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DataBindingCountAggregateInputType | true
    _min?: DataBindingMinAggregateInputType
    _max?: DataBindingMaxAggregateInputType
  }

  export type DataBindingGroupByOutputType = {
    id: string
    storeId: string
    componentPath: string
    bindingKey: string
    sourceType: string
    sourceRef: string
    bindingJson: string | null
    updatedAt: Date
    _count: DataBindingCountAggregateOutputType | null
    _min: DataBindingMinAggregateOutputType | null
    _max: DataBindingMaxAggregateOutputType | null
  }

  type GetDataBindingGroupByPayload<T extends DataBindingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DataBindingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DataBindingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DataBindingGroupByOutputType[P]>
            : GetScalarType<T[P], DataBindingGroupByOutputType[P]>
        }
      >
    >


  export type DataBindingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    storeId?: boolean
    componentPath?: boolean
    bindingKey?: boolean
    sourceType?: boolean
    sourceRef?: boolean
    bindingJson?: boolean
    updatedAt?: boolean
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dataBinding"]>

  export type DataBindingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    storeId?: boolean
    componentPath?: boolean
    bindingKey?: boolean
    sourceType?: boolean
    sourceRef?: boolean
    bindingJson?: boolean
    updatedAt?: boolean
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dataBinding"]>

  export type DataBindingSelectScalar = {
    id?: boolean
    storeId?: boolean
    componentPath?: boolean
    bindingKey?: boolean
    sourceType?: boolean
    sourceRef?: boolean
    bindingJson?: boolean
    updatedAt?: boolean
  }

  export type DataBindingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }
  export type DataBindingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }

  export type $DataBindingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DataBinding"
    objects: {
      store: Prisma.$StorePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      storeId: string
      componentPath: string
      bindingKey: string
      sourceType: string
      sourceRef: string
      bindingJson: string | null
      updatedAt: Date
    }, ExtArgs["result"]["dataBinding"]>
    composites: {}
  }

  type DataBindingGetPayload<S extends boolean | null | undefined | DataBindingDefaultArgs> = $Result.GetResult<Prisma.$DataBindingPayload, S>

  type DataBindingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DataBindingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DataBindingCountAggregateInputType | true
    }

  export interface DataBindingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DataBinding'], meta: { name: 'DataBinding' } }
    /**
     * Find zero or one DataBinding that matches the filter.
     * @param {DataBindingFindUniqueArgs} args - Arguments to find a DataBinding
     * @example
     * // Get one DataBinding
     * const dataBinding = await prisma.dataBinding.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DataBindingFindUniqueArgs>(args: SelectSubset<T, DataBindingFindUniqueArgs<ExtArgs>>): Prisma__DataBindingClient<$Result.GetResult<Prisma.$DataBindingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DataBinding that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DataBindingFindUniqueOrThrowArgs} args - Arguments to find a DataBinding
     * @example
     * // Get one DataBinding
     * const dataBinding = await prisma.dataBinding.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DataBindingFindUniqueOrThrowArgs>(args: SelectSubset<T, DataBindingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DataBindingClient<$Result.GetResult<Prisma.$DataBindingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DataBinding that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataBindingFindFirstArgs} args - Arguments to find a DataBinding
     * @example
     * // Get one DataBinding
     * const dataBinding = await prisma.dataBinding.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DataBindingFindFirstArgs>(args?: SelectSubset<T, DataBindingFindFirstArgs<ExtArgs>>): Prisma__DataBindingClient<$Result.GetResult<Prisma.$DataBindingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DataBinding that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataBindingFindFirstOrThrowArgs} args - Arguments to find a DataBinding
     * @example
     * // Get one DataBinding
     * const dataBinding = await prisma.dataBinding.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DataBindingFindFirstOrThrowArgs>(args?: SelectSubset<T, DataBindingFindFirstOrThrowArgs<ExtArgs>>): Prisma__DataBindingClient<$Result.GetResult<Prisma.$DataBindingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DataBindings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataBindingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DataBindings
     * const dataBindings = await prisma.dataBinding.findMany()
     * 
     * // Get first 10 DataBindings
     * const dataBindings = await prisma.dataBinding.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dataBindingWithIdOnly = await prisma.dataBinding.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DataBindingFindManyArgs>(args?: SelectSubset<T, DataBindingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataBindingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DataBinding.
     * @param {DataBindingCreateArgs} args - Arguments to create a DataBinding.
     * @example
     * // Create one DataBinding
     * const DataBinding = await prisma.dataBinding.create({
     *   data: {
     *     // ... data to create a DataBinding
     *   }
     * })
     * 
     */
    create<T extends DataBindingCreateArgs>(args: SelectSubset<T, DataBindingCreateArgs<ExtArgs>>): Prisma__DataBindingClient<$Result.GetResult<Prisma.$DataBindingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DataBindings.
     * @param {DataBindingCreateManyArgs} args - Arguments to create many DataBindings.
     * @example
     * // Create many DataBindings
     * const dataBinding = await prisma.dataBinding.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DataBindingCreateManyArgs>(args?: SelectSubset<T, DataBindingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DataBindings and returns the data saved in the database.
     * @param {DataBindingCreateManyAndReturnArgs} args - Arguments to create many DataBindings.
     * @example
     * // Create many DataBindings
     * const dataBinding = await prisma.dataBinding.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DataBindings and only return the `id`
     * const dataBindingWithIdOnly = await prisma.dataBinding.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DataBindingCreateManyAndReturnArgs>(args?: SelectSubset<T, DataBindingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DataBindingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DataBinding.
     * @param {DataBindingDeleteArgs} args - Arguments to delete one DataBinding.
     * @example
     * // Delete one DataBinding
     * const DataBinding = await prisma.dataBinding.delete({
     *   where: {
     *     // ... filter to delete one DataBinding
     *   }
     * })
     * 
     */
    delete<T extends DataBindingDeleteArgs>(args: SelectSubset<T, DataBindingDeleteArgs<ExtArgs>>): Prisma__DataBindingClient<$Result.GetResult<Prisma.$DataBindingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DataBinding.
     * @param {DataBindingUpdateArgs} args - Arguments to update one DataBinding.
     * @example
     * // Update one DataBinding
     * const dataBinding = await prisma.dataBinding.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DataBindingUpdateArgs>(args: SelectSubset<T, DataBindingUpdateArgs<ExtArgs>>): Prisma__DataBindingClient<$Result.GetResult<Prisma.$DataBindingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DataBindings.
     * @param {DataBindingDeleteManyArgs} args - Arguments to filter DataBindings to delete.
     * @example
     * // Delete a few DataBindings
     * const { count } = await prisma.dataBinding.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DataBindingDeleteManyArgs>(args?: SelectSubset<T, DataBindingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DataBindings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataBindingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DataBindings
     * const dataBinding = await prisma.dataBinding.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DataBindingUpdateManyArgs>(args: SelectSubset<T, DataBindingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DataBinding.
     * @param {DataBindingUpsertArgs} args - Arguments to update or create a DataBinding.
     * @example
     * // Update or create a DataBinding
     * const dataBinding = await prisma.dataBinding.upsert({
     *   create: {
     *     // ... data to create a DataBinding
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DataBinding we want to update
     *   }
     * })
     */
    upsert<T extends DataBindingUpsertArgs>(args: SelectSubset<T, DataBindingUpsertArgs<ExtArgs>>): Prisma__DataBindingClient<$Result.GetResult<Prisma.$DataBindingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DataBindings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataBindingCountArgs} args - Arguments to filter DataBindings to count.
     * @example
     * // Count the number of DataBindings
     * const count = await prisma.dataBinding.count({
     *   where: {
     *     // ... the filter for the DataBindings we want to count
     *   }
     * })
    **/
    count<T extends DataBindingCountArgs>(
      args?: Subset<T, DataBindingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DataBindingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DataBinding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataBindingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DataBindingAggregateArgs>(args: Subset<T, DataBindingAggregateArgs>): Prisma.PrismaPromise<GetDataBindingAggregateType<T>>

    /**
     * Group by DataBinding.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DataBindingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DataBindingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DataBindingGroupByArgs['orderBy'] }
        : { orderBy?: DataBindingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DataBindingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDataBindingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DataBinding model
   */
  readonly fields: DataBindingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DataBinding.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DataBindingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    store<T extends StoreDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StoreDefaultArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DataBinding model
   */ 
  interface DataBindingFieldRefs {
    readonly id: FieldRef<"DataBinding", 'String'>
    readonly storeId: FieldRef<"DataBinding", 'String'>
    readonly componentPath: FieldRef<"DataBinding", 'String'>
    readonly bindingKey: FieldRef<"DataBinding", 'String'>
    readonly sourceType: FieldRef<"DataBinding", 'String'>
    readonly sourceRef: FieldRef<"DataBinding", 'String'>
    readonly bindingJson: FieldRef<"DataBinding", 'String'>
    readonly updatedAt: FieldRef<"DataBinding", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DataBinding findUnique
   */
  export type DataBindingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataBinding
     */
    select?: DataBindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataBindingInclude<ExtArgs> | null
    /**
     * Filter, which DataBinding to fetch.
     */
    where: DataBindingWhereUniqueInput
  }

  /**
   * DataBinding findUniqueOrThrow
   */
  export type DataBindingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataBinding
     */
    select?: DataBindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataBindingInclude<ExtArgs> | null
    /**
     * Filter, which DataBinding to fetch.
     */
    where: DataBindingWhereUniqueInput
  }

  /**
   * DataBinding findFirst
   */
  export type DataBindingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataBinding
     */
    select?: DataBindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataBindingInclude<ExtArgs> | null
    /**
     * Filter, which DataBinding to fetch.
     */
    where?: DataBindingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataBindings to fetch.
     */
    orderBy?: DataBindingOrderByWithRelationInput | DataBindingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DataBindings.
     */
    cursor?: DataBindingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataBindings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataBindings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DataBindings.
     */
    distinct?: DataBindingScalarFieldEnum | DataBindingScalarFieldEnum[]
  }

  /**
   * DataBinding findFirstOrThrow
   */
  export type DataBindingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataBinding
     */
    select?: DataBindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataBindingInclude<ExtArgs> | null
    /**
     * Filter, which DataBinding to fetch.
     */
    where?: DataBindingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataBindings to fetch.
     */
    orderBy?: DataBindingOrderByWithRelationInput | DataBindingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DataBindings.
     */
    cursor?: DataBindingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataBindings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataBindings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DataBindings.
     */
    distinct?: DataBindingScalarFieldEnum | DataBindingScalarFieldEnum[]
  }

  /**
   * DataBinding findMany
   */
  export type DataBindingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataBinding
     */
    select?: DataBindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataBindingInclude<ExtArgs> | null
    /**
     * Filter, which DataBindings to fetch.
     */
    where?: DataBindingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DataBindings to fetch.
     */
    orderBy?: DataBindingOrderByWithRelationInput | DataBindingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DataBindings.
     */
    cursor?: DataBindingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DataBindings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DataBindings.
     */
    skip?: number
    distinct?: DataBindingScalarFieldEnum | DataBindingScalarFieldEnum[]
  }

  /**
   * DataBinding create
   */
  export type DataBindingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataBinding
     */
    select?: DataBindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataBindingInclude<ExtArgs> | null
    /**
     * The data needed to create a DataBinding.
     */
    data: XOR<DataBindingCreateInput, DataBindingUncheckedCreateInput>
  }

  /**
   * DataBinding createMany
   */
  export type DataBindingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DataBindings.
     */
    data: DataBindingCreateManyInput | DataBindingCreateManyInput[]
  }

  /**
   * DataBinding createManyAndReturn
   */
  export type DataBindingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataBinding
     */
    select?: DataBindingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DataBindings.
     */
    data: DataBindingCreateManyInput | DataBindingCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataBindingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DataBinding update
   */
  export type DataBindingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataBinding
     */
    select?: DataBindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataBindingInclude<ExtArgs> | null
    /**
     * The data needed to update a DataBinding.
     */
    data: XOR<DataBindingUpdateInput, DataBindingUncheckedUpdateInput>
    /**
     * Choose, which DataBinding to update.
     */
    where: DataBindingWhereUniqueInput
  }

  /**
   * DataBinding updateMany
   */
  export type DataBindingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DataBindings.
     */
    data: XOR<DataBindingUpdateManyMutationInput, DataBindingUncheckedUpdateManyInput>
    /**
     * Filter which DataBindings to update
     */
    where?: DataBindingWhereInput
  }

  /**
   * DataBinding upsert
   */
  export type DataBindingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataBinding
     */
    select?: DataBindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataBindingInclude<ExtArgs> | null
    /**
     * The filter to search for the DataBinding to update in case it exists.
     */
    where: DataBindingWhereUniqueInput
    /**
     * In case the DataBinding found by the `where` argument doesn't exist, create a new DataBinding with this data.
     */
    create: XOR<DataBindingCreateInput, DataBindingUncheckedCreateInput>
    /**
     * In case the DataBinding was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DataBindingUpdateInput, DataBindingUncheckedUpdateInput>
  }

  /**
   * DataBinding delete
   */
  export type DataBindingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataBinding
     */
    select?: DataBindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataBindingInclude<ExtArgs> | null
    /**
     * Filter which DataBinding to delete.
     */
    where: DataBindingWhereUniqueInput
  }

  /**
   * DataBinding deleteMany
   */
  export type DataBindingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DataBindings to delete
     */
    where?: DataBindingWhereInput
  }

  /**
   * DataBinding without action
   */
  export type DataBindingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DataBinding
     */
    select?: DataBindingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DataBindingInclude<ExtArgs> | null
  }


  /**
   * Model Snapshot
   */

  export type AggregateSnapshot = {
    _count: SnapshotCountAggregateOutputType | null
    _min: SnapshotMinAggregateOutputType | null
    _max: SnapshotMaxAggregateOutputType | null
  }

  export type SnapshotMinAggregateOutputType = {
    id: string | null
    storeId: string | null
    label: string | null
    snapshotJson: string | null
    createdAt: Date | null
  }

  export type SnapshotMaxAggregateOutputType = {
    id: string | null
    storeId: string | null
    label: string | null
    snapshotJson: string | null
    createdAt: Date | null
  }

  export type SnapshotCountAggregateOutputType = {
    id: number
    storeId: number
    label: number
    snapshotJson: number
    createdAt: number
    _all: number
  }


  export type SnapshotMinAggregateInputType = {
    id?: true
    storeId?: true
    label?: true
    snapshotJson?: true
    createdAt?: true
  }

  export type SnapshotMaxAggregateInputType = {
    id?: true
    storeId?: true
    label?: true
    snapshotJson?: true
    createdAt?: true
  }

  export type SnapshotCountAggregateInputType = {
    id?: true
    storeId?: true
    label?: true
    snapshotJson?: true
    createdAt?: true
    _all?: true
  }

  export type SnapshotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Snapshot to aggregate.
     */
    where?: SnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Snapshots to fetch.
     */
    orderBy?: SnapshotOrderByWithRelationInput | SnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Snapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Snapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Snapshots
    **/
    _count?: true | SnapshotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SnapshotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SnapshotMaxAggregateInputType
  }

  export type GetSnapshotAggregateType<T extends SnapshotAggregateArgs> = {
        [P in keyof T & keyof AggregateSnapshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSnapshot[P]>
      : GetScalarType<T[P], AggregateSnapshot[P]>
  }




  export type SnapshotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SnapshotWhereInput
    orderBy?: SnapshotOrderByWithAggregationInput | SnapshotOrderByWithAggregationInput[]
    by: SnapshotScalarFieldEnum[] | SnapshotScalarFieldEnum
    having?: SnapshotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SnapshotCountAggregateInputType | true
    _min?: SnapshotMinAggregateInputType
    _max?: SnapshotMaxAggregateInputType
  }

  export type SnapshotGroupByOutputType = {
    id: string
    storeId: string
    label: string
    snapshotJson: string
    createdAt: Date
    _count: SnapshotCountAggregateOutputType | null
    _min: SnapshotMinAggregateOutputType | null
    _max: SnapshotMaxAggregateOutputType | null
  }

  type GetSnapshotGroupByPayload<T extends SnapshotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SnapshotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SnapshotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SnapshotGroupByOutputType[P]>
            : GetScalarType<T[P], SnapshotGroupByOutputType[P]>
        }
      >
    >


  export type SnapshotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    storeId?: boolean
    label?: boolean
    snapshotJson?: boolean
    createdAt?: boolean
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["snapshot"]>

  export type SnapshotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    storeId?: boolean
    label?: boolean
    snapshotJson?: boolean
    createdAt?: boolean
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["snapshot"]>

  export type SnapshotSelectScalar = {
    id?: boolean
    storeId?: boolean
    label?: boolean
    snapshotJson?: boolean
    createdAt?: boolean
  }

  export type SnapshotInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }
  export type SnapshotIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    store?: boolean | StoreDefaultArgs<ExtArgs>
  }

  export type $SnapshotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Snapshot"
    objects: {
      store: Prisma.$StorePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      storeId: string
      label: string
      snapshotJson: string
      createdAt: Date
    }, ExtArgs["result"]["snapshot"]>
    composites: {}
  }

  type SnapshotGetPayload<S extends boolean | null | undefined | SnapshotDefaultArgs> = $Result.GetResult<Prisma.$SnapshotPayload, S>

  type SnapshotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SnapshotFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SnapshotCountAggregateInputType | true
    }

  export interface SnapshotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Snapshot'], meta: { name: 'Snapshot' } }
    /**
     * Find zero or one Snapshot that matches the filter.
     * @param {SnapshotFindUniqueArgs} args - Arguments to find a Snapshot
     * @example
     * // Get one Snapshot
     * const snapshot = await prisma.snapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SnapshotFindUniqueArgs>(args: SelectSubset<T, SnapshotFindUniqueArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Snapshot that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SnapshotFindUniqueOrThrowArgs} args - Arguments to find a Snapshot
     * @example
     * // Get one Snapshot
     * const snapshot = await prisma.snapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SnapshotFindUniqueOrThrowArgs>(args: SelectSubset<T, SnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Snapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotFindFirstArgs} args - Arguments to find a Snapshot
     * @example
     * // Get one Snapshot
     * const snapshot = await prisma.snapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SnapshotFindFirstArgs>(args?: SelectSubset<T, SnapshotFindFirstArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Snapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotFindFirstOrThrowArgs} args - Arguments to find a Snapshot
     * @example
     * // Get one Snapshot
     * const snapshot = await prisma.snapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SnapshotFindFirstOrThrowArgs>(args?: SelectSubset<T, SnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Snapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Snapshots
     * const snapshots = await prisma.snapshot.findMany()
     * 
     * // Get first 10 Snapshots
     * const snapshots = await prisma.snapshot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const snapshotWithIdOnly = await prisma.snapshot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SnapshotFindManyArgs>(args?: SelectSubset<T, SnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Snapshot.
     * @param {SnapshotCreateArgs} args - Arguments to create a Snapshot.
     * @example
     * // Create one Snapshot
     * const Snapshot = await prisma.snapshot.create({
     *   data: {
     *     // ... data to create a Snapshot
     *   }
     * })
     * 
     */
    create<T extends SnapshotCreateArgs>(args: SelectSubset<T, SnapshotCreateArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Snapshots.
     * @param {SnapshotCreateManyArgs} args - Arguments to create many Snapshots.
     * @example
     * // Create many Snapshots
     * const snapshot = await prisma.snapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SnapshotCreateManyArgs>(args?: SelectSubset<T, SnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Snapshots and returns the data saved in the database.
     * @param {SnapshotCreateManyAndReturnArgs} args - Arguments to create many Snapshots.
     * @example
     * // Create many Snapshots
     * const snapshot = await prisma.snapshot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Snapshots and only return the `id`
     * const snapshotWithIdOnly = await prisma.snapshot.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SnapshotCreateManyAndReturnArgs>(args?: SelectSubset<T, SnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Snapshot.
     * @param {SnapshotDeleteArgs} args - Arguments to delete one Snapshot.
     * @example
     * // Delete one Snapshot
     * const Snapshot = await prisma.snapshot.delete({
     *   where: {
     *     // ... filter to delete one Snapshot
     *   }
     * })
     * 
     */
    delete<T extends SnapshotDeleteArgs>(args: SelectSubset<T, SnapshotDeleteArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Snapshot.
     * @param {SnapshotUpdateArgs} args - Arguments to update one Snapshot.
     * @example
     * // Update one Snapshot
     * const snapshot = await prisma.snapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SnapshotUpdateArgs>(args: SelectSubset<T, SnapshotUpdateArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Snapshots.
     * @param {SnapshotDeleteManyArgs} args - Arguments to filter Snapshots to delete.
     * @example
     * // Delete a few Snapshots
     * const { count } = await prisma.snapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SnapshotDeleteManyArgs>(args?: SelectSubset<T, SnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Snapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Snapshots
     * const snapshot = await prisma.snapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SnapshotUpdateManyArgs>(args: SelectSubset<T, SnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Snapshot.
     * @param {SnapshotUpsertArgs} args - Arguments to update or create a Snapshot.
     * @example
     * // Update or create a Snapshot
     * const snapshot = await prisma.snapshot.upsert({
     *   create: {
     *     // ... data to create a Snapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Snapshot we want to update
     *   }
     * })
     */
    upsert<T extends SnapshotUpsertArgs>(args: SelectSubset<T, SnapshotUpsertArgs<ExtArgs>>): Prisma__SnapshotClient<$Result.GetResult<Prisma.$SnapshotPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Snapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotCountArgs} args - Arguments to filter Snapshots to count.
     * @example
     * // Count the number of Snapshots
     * const count = await prisma.snapshot.count({
     *   where: {
     *     // ... the filter for the Snapshots we want to count
     *   }
     * })
    **/
    count<T extends SnapshotCountArgs>(
      args?: Subset<T, SnapshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SnapshotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Snapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SnapshotAggregateArgs>(args: Subset<T, SnapshotAggregateArgs>): Prisma.PrismaPromise<GetSnapshotAggregateType<T>>

    /**
     * Group by Snapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnapshotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SnapshotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SnapshotGroupByArgs['orderBy'] }
        : { orderBy?: SnapshotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Snapshot model
   */
  readonly fields: SnapshotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Snapshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SnapshotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    store<T extends StoreDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StoreDefaultArgs<ExtArgs>>): Prisma__StoreClient<$Result.GetResult<Prisma.$StorePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Snapshot model
   */ 
  interface SnapshotFieldRefs {
    readonly id: FieldRef<"Snapshot", 'String'>
    readonly storeId: FieldRef<"Snapshot", 'String'>
    readonly label: FieldRef<"Snapshot", 'String'>
    readonly snapshotJson: FieldRef<"Snapshot", 'String'>
    readonly createdAt: FieldRef<"Snapshot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Snapshot findUnique
   */
  export type SnapshotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
    /**
     * Filter, which Snapshot to fetch.
     */
    where: SnapshotWhereUniqueInput
  }

  /**
   * Snapshot findUniqueOrThrow
   */
  export type SnapshotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
    /**
     * Filter, which Snapshot to fetch.
     */
    where: SnapshotWhereUniqueInput
  }

  /**
   * Snapshot findFirst
   */
  export type SnapshotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
    /**
     * Filter, which Snapshot to fetch.
     */
    where?: SnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Snapshots to fetch.
     */
    orderBy?: SnapshotOrderByWithRelationInput | SnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Snapshots.
     */
    cursor?: SnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Snapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Snapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Snapshots.
     */
    distinct?: SnapshotScalarFieldEnum | SnapshotScalarFieldEnum[]
  }

  /**
   * Snapshot findFirstOrThrow
   */
  export type SnapshotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
    /**
     * Filter, which Snapshot to fetch.
     */
    where?: SnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Snapshots to fetch.
     */
    orderBy?: SnapshotOrderByWithRelationInput | SnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Snapshots.
     */
    cursor?: SnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Snapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Snapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Snapshots.
     */
    distinct?: SnapshotScalarFieldEnum | SnapshotScalarFieldEnum[]
  }

  /**
   * Snapshot findMany
   */
  export type SnapshotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
    /**
     * Filter, which Snapshots to fetch.
     */
    where?: SnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Snapshots to fetch.
     */
    orderBy?: SnapshotOrderByWithRelationInput | SnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Snapshots.
     */
    cursor?: SnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Snapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Snapshots.
     */
    skip?: number
    distinct?: SnapshotScalarFieldEnum | SnapshotScalarFieldEnum[]
  }

  /**
   * Snapshot create
   */
  export type SnapshotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
    /**
     * The data needed to create a Snapshot.
     */
    data: XOR<SnapshotCreateInput, SnapshotUncheckedCreateInput>
  }

  /**
   * Snapshot createMany
   */
  export type SnapshotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Snapshots.
     */
    data: SnapshotCreateManyInput | SnapshotCreateManyInput[]
  }

  /**
   * Snapshot createManyAndReturn
   */
  export type SnapshotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Snapshots.
     */
    data: SnapshotCreateManyInput | SnapshotCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Snapshot update
   */
  export type SnapshotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
    /**
     * The data needed to update a Snapshot.
     */
    data: XOR<SnapshotUpdateInput, SnapshotUncheckedUpdateInput>
    /**
     * Choose, which Snapshot to update.
     */
    where: SnapshotWhereUniqueInput
  }

  /**
   * Snapshot updateMany
   */
  export type SnapshotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Snapshots.
     */
    data: XOR<SnapshotUpdateManyMutationInput, SnapshotUncheckedUpdateManyInput>
    /**
     * Filter which Snapshots to update
     */
    where?: SnapshotWhereInput
  }

  /**
   * Snapshot upsert
   */
  export type SnapshotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
    /**
     * The filter to search for the Snapshot to update in case it exists.
     */
    where: SnapshotWhereUniqueInput
    /**
     * In case the Snapshot found by the `where` argument doesn't exist, create a new Snapshot with this data.
     */
    create: XOR<SnapshotCreateInput, SnapshotUncheckedCreateInput>
    /**
     * In case the Snapshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SnapshotUpdateInput, SnapshotUncheckedUpdateInput>
  }

  /**
   * Snapshot delete
   */
  export type SnapshotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
    /**
     * Filter which Snapshot to delete.
     */
    where: SnapshotWhereUniqueInput
  }

  /**
   * Snapshot deleteMany
   */
  export type SnapshotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Snapshots to delete
     */
    where?: SnapshotWhereInput
  }

  /**
   * Snapshot without action
   */
  export type SnapshotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snapshot
     */
    select?: SnapshotSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnapshotInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ThemeScalarFieldEnum: {
    id: 'id',
    nameAr: 'nameAr',
    nameEn: 'nameEn',
    repository: 'repository',
    authorEmail: 'authorEmail',
    supportUrl: 'supportUrl',
    descriptionAr: 'descriptionAr',
    descriptionEn: 'descriptionEn',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ThemeScalarFieldEnum = (typeof ThemeScalarFieldEnum)[keyof typeof ThemeScalarFieldEnum]


  export const ThemeVersionScalarFieldEnum: {
    id: 'id',
    themeId: 'themeId',
    version: 'version',
    fsPath: 'fsPath',
    contractJson: 'contractJson',
    capabilitiesJson: 'capabilitiesJson',
    schemaHash: 'schemaHash',
    createdAt: 'createdAt'
  };

  export type ThemeVersionScalarFieldEnum = (typeof ThemeVersionScalarFieldEnum)[keyof typeof ThemeVersionScalarFieldEnum]


  export const StoreScalarFieldEnum: {
    id: 'id',
    title: 'title',
    defaultLocale: 'defaultLocale',
    defaultCurrency: 'defaultCurrency',
    themeId: 'themeId',
    themeVersionId: 'themeVersionId',
    activePage: 'activePage',
    viewport: 'viewport',
    settingsJson: 'settingsJson',
    themeSettingsJson: 'themeSettingsJson',
    brandingJson: 'brandingJson',
    isMaster: 'isMaster',
    parentStoreId: 'parentStoreId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type StoreScalarFieldEnum = (typeof StoreScalarFieldEnum)[keyof typeof StoreScalarFieldEnum]


  export const StoreStateScalarFieldEnum: {
    storeId: 'storeId',
    themeId: 'themeId',
    themeVersionId: 'themeVersionId',
    activePage: 'activePage',
    viewport: 'viewport',
    settingsJson: 'settingsJson',
    updatedAt: 'updatedAt'
  };

  export type StoreStateScalarFieldEnum = (typeof StoreStateScalarFieldEnum)[keyof typeof StoreStateScalarFieldEnum]


  export const ComponentStateScalarFieldEnum: {
    id: 'id',
    storeId: 'storeId',
    componentPath: 'componentPath',
    componentKey: 'componentKey',
    instanceOrder: 'instanceOrder',
    settingsJson: 'settingsJson',
    visibilityJson: 'visibilityJson',
    updatedAt: 'updatedAt'
  };

  export type ComponentStateScalarFieldEnum = (typeof ComponentStateScalarFieldEnum)[keyof typeof ComponentStateScalarFieldEnum]


  export const PageCompositionScalarFieldEnum: {
    id: 'id',
    storeId: 'storeId',
    page: 'page',
    compositionJson: 'compositionJson',
    updatedAt: 'updatedAt'
  };

  export type PageCompositionScalarFieldEnum = (typeof PageCompositionScalarFieldEnum)[keyof typeof PageCompositionScalarFieldEnum]


  export const DataEntityScalarFieldEnum: {
    id: 'id',
    storeId: 'storeId',
    entityType: 'entityType',
    entityKey: 'entityKey',
    payloadJson: 'payloadJson',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DataEntityScalarFieldEnum = (typeof DataEntityScalarFieldEnum)[keyof typeof DataEntityScalarFieldEnum]


  export const CollectionScalarFieldEnum: {
    id: 'id',
    storeId: 'storeId',
    name: 'name',
    source: 'source',
    rulesJson: 'rulesJson',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CollectionScalarFieldEnum = (typeof CollectionScalarFieldEnum)[keyof typeof CollectionScalarFieldEnum]


  export const CollectionItemScalarFieldEnum: {
    collectionId: 'collectionId',
    entityId: 'entityId',
    sortOrder: 'sortOrder'
  };

  export type CollectionItemScalarFieldEnum = (typeof CollectionItemScalarFieldEnum)[keyof typeof CollectionItemScalarFieldEnum]


  export const DataBindingScalarFieldEnum: {
    id: 'id',
    storeId: 'storeId',
    componentPath: 'componentPath',
    bindingKey: 'bindingKey',
    sourceType: 'sourceType',
    sourceRef: 'sourceRef',
    bindingJson: 'bindingJson',
    updatedAt: 'updatedAt'
  };

  export type DataBindingScalarFieldEnum = (typeof DataBindingScalarFieldEnum)[keyof typeof DataBindingScalarFieldEnum]


  export const SnapshotScalarFieldEnum: {
    id: 'id',
    storeId: 'storeId',
    label: 'label',
    snapshotJson: 'snapshotJson',
    createdAt: 'createdAt'
  };

  export type SnapshotScalarFieldEnum = (typeof SnapshotScalarFieldEnum)[keyof typeof SnapshotScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type ThemeWhereInput = {
    AND?: ThemeWhereInput | ThemeWhereInput[]
    OR?: ThemeWhereInput[]
    NOT?: ThemeWhereInput | ThemeWhereInput[]
    id?: StringFilter<"Theme"> | string
    nameAr?: StringNullableFilter<"Theme"> | string | null
    nameEn?: StringNullableFilter<"Theme"> | string | null
    repository?: StringNullableFilter<"Theme"> | string | null
    authorEmail?: StringNullableFilter<"Theme"> | string | null
    supportUrl?: StringNullableFilter<"Theme"> | string | null
    descriptionAr?: StringNullableFilter<"Theme"> | string | null
    descriptionEn?: StringNullableFilter<"Theme"> | string | null
    createdAt?: DateTimeFilter<"Theme"> | Date | string
    updatedAt?: DateTimeFilter<"Theme"> | Date | string
    storeStates?: StoreStateListRelationFilter
    versions?: ThemeVersionListRelationFilter
    stores?: StoreListRelationFilter
  }

  export type ThemeOrderByWithRelationInput = {
    id?: SortOrder
    nameAr?: SortOrderInput | SortOrder
    nameEn?: SortOrderInput | SortOrder
    repository?: SortOrderInput | SortOrder
    authorEmail?: SortOrderInput | SortOrder
    supportUrl?: SortOrderInput | SortOrder
    descriptionAr?: SortOrderInput | SortOrder
    descriptionEn?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    storeStates?: StoreStateOrderByRelationAggregateInput
    versions?: ThemeVersionOrderByRelationAggregateInput
    stores?: StoreOrderByRelationAggregateInput
  }

  export type ThemeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ThemeWhereInput | ThemeWhereInput[]
    OR?: ThemeWhereInput[]
    NOT?: ThemeWhereInput | ThemeWhereInput[]
    nameAr?: StringNullableFilter<"Theme"> | string | null
    nameEn?: StringNullableFilter<"Theme"> | string | null
    repository?: StringNullableFilter<"Theme"> | string | null
    authorEmail?: StringNullableFilter<"Theme"> | string | null
    supportUrl?: StringNullableFilter<"Theme"> | string | null
    descriptionAr?: StringNullableFilter<"Theme"> | string | null
    descriptionEn?: StringNullableFilter<"Theme"> | string | null
    createdAt?: DateTimeFilter<"Theme"> | Date | string
    updatedAt?: DateTimeFilter<"Theme"> | Date | string
    storeStates?: StoreStateListRelationFilter
    versions?: ThemeVersionListRelationFilter
    stores?: StoreListRelationFilter
  }, "id">

  export type ThemeOrderByWithAggregationInput = {
    id?: SortOrder
    nameAr?: SortOrderInput | SortOrder
    nameEn?: SortOrderInput | SortOrder
    repository?: SortOrderInput | SortOrder
    authorEmail?: SortOrderInput | SortOrder
    supportUrl?: SortOrderInput | SortOrder
    descriptionAr?: SortOrderInput | SortOrder
    descriptionEn?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ThemeCountOrderByAggregateInput
    _max?: ThemeMaxOrderByAggregateInput
    _min?: ThemeMinOrderByAggregateInput
  }

  export type ThemeScalarWhereWithAggregatesInput = {
    AND?: ThemeScalarWhereWithAggregatesInput | ThemeScalarWhereWithAggregatesInput[]
    OR?: ThemeScalarWhereWithAggregatesInput[]
    NOT?: ThemeScalarWhereWithAggregatesInput | ThemeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Theme"> | string
    nameAr?: StringNullableWithAggregatesFilter<"Theme"> | string | null
    nameEn?: StringNullableWithAggregatesFilter<"Theme"> | string | null
    repository?: StringNullableWithAggregatesFilter<"Theme"> | string | null
    authorEmail?: StringNullableWithAggregatesFilter<"Theme"> | string | null
    supportUrl?: StringNullableWithAggregatesFilter<"Theme"> | string | null
    descriptionAr?: StringNullableWithAggregatesFilter<"Theme"> | string | null
    descriptionEn?: StringNullableWithAggregatesFilter<"Theme"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Theme"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Theme"> | Date | string
  }

  export type ThemeVersionWhereInput = {
    AND?: ThemeVersionWhereInput | ThemeVersionWhereInput[]
    OR?: ThemeVersionWhereInput[]
    NOT?: ThemeVersionWhereInput | ThemeVersionWhereInput[]
    id?: StringFilter<"ThemeVersion"> | string
    themeId?: StringFilter<"ThemeVersion"> | string
    version?: StringFilter<"ThemeVersion"> | string
    fsPath?: StringFilter<"ThemeVersion"> | string
    contractJson?: StringFilter<"ThemeVersion"> | string
    capabilitiesJson?: StringNullableFilter<"ThemeVersion"> | string | null
    schemaHash?: StringNullableFilter<"ThemeVersion"> | string | null
    createdAt?: DateTimeFilter<"ThemeVersion"> | Date | string
    storeStates?: StoreStateListRelationFilter
    theme?: XOR<ThemeRelationFilter, ThemeWhereInput>
    stores?: StoreListRelationFilter
  }

  export type ThemeVersionOrderByWithRelationInput = {
    id?: SortOrder
    themeId?: SortOrder
    version?: SortOrder
    fsPath?: SortOrder
    contractJson?: SortOrder
    capabilitiesJson?: SortOrderInput | SortOrder
    schemaHash?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    storeStates?: StoreStateOrderByRelationAggregateInput
    theme?: ThemeOrderByWithRelationInput
    stores?: StoreOrderByRelationAggregateInput
  }

  export type ThemeVersionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    themeId_version?: ThemeVersionThemeIdVersionCompoundUniqueInput
    AND?: ThemeVersionWhereInput | ThemeVersionWhereInput[]
    OR?: ThemeVersionWhereInput[]
    NOT?: ThemeVersionWhereInput | ThemeVersionWhereInput[]
    themeId?: StringFilter<"ThemeVersion"> | string
    version?: StringFilter<"ThemeVersion"> | string
    fsPath?: StringFilter<"ThemeVersion"> | string
    contractJson?: StringFilter<"ThemeVersion"> | string
    capabilitiesJson?: StringNullableFilter<"ThemeVersion"> | string | null
    schemaHash?: StringNullableFilter<"ThemeVersion"> | string | null
    createdAt?: DateTimeFilter<"ThemeVersion"> | Date | string
    storeStates?: StoreStateListRelationFilter
    theme?: XOR<ThemeRelationFilter, ThemeWhereInput>
    stores?: StoreListRelationFilter
  }, "id" | "themeId_version">

  export type ThemeVersionOrderByWithAggregationInput = {
    id?: SortOrder
    themeId?: SortOrder
    version?: SortOrder
    fsPath?: SortOrder
    contractJson?: SortOrder
    capabilitiesJson?: SortOrderInput | SortOrder
    schemaHash?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ThemeVersionCountOrderByAggregateInput
    _max?: ThemeVersionMaxOrderByAggregateInput
    _min?: ThemeVersionMinOrderByAggregateInput
  }

  export type ThemeVersionScalarWhereWithAggregatesInput = {
    AND?: ThemeVersionScalarWhereWithAggregatesInput | ThemeVersionScalarWhereWithAggregatesInput[]
    OR?: ThemeVersionScalarWhereWithAggregatesInput[]
    NOT?: ThemeVersionScalarWhereWithAggregatesInput | ThemeVersionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ThemeVersion"> | string
    themeId?: StringWithAggregatesFilter<"ThemeVersion"> | string
    version?: StringWithAggregatesFilter<"ThemeVersion"> | string
    fsPath?: StringWithAggregatesFilter<"ThemeVersion"> | string
    contractJson?: StringWithAggregatesFilter<"ThemeVersion"> | string
    capabilitiesJson?: StringNullableWithAggregatesFilter<"ThemeVersion"> | string | null
    schemaHash?: StringNullableWithAggregatesFilter<"ThemeVersion"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ThemeVersion"> | Date | string
  }

  export type StoreWhereInput = {
    AND?: StoreWhereInput | StoreWhereInput[]
    OR?: StoreWhereInput[]
    NOT?: StoreWhereInput | StoreWhereInput[]
    id?: StringFilter<"Store"> | string
    title?: StringFilter<"Store"> | string
    defaultLocale?: StringFilter<"Store"> | string
    defaultCurrency?: StringFilter<"Store"> | string
    themeId?: StringFilter<"Store"> | string
    themeVersionId?: StringFilter<"Store"> | string
    activePage?: StringFilter<"Store"> | string
    viewport?: StringFilter<"Store"> | string
    settingsJson?: StringFilter<"Store"> | string
    themeSettingsJson?: StringFilter<"Store"> | string
    brandingJson?: StringNullableFilter<"Store"> | string | null
    isMaster?: BoolFilter<"Store"> | boolean
    parentStoreId?: StringNullableFilter<"Store"> | string | null
    createdAt?: DateTimeFilter<"Store"> | Date | string
    updatedAt?: DateTimeFilter<"Store"> | Date | string
    theme?: XOR<ThemeRelationFilter, ThemeWhereInput>
    themeVersion?: XOR<ThemeVersionRelationFilter, ThemeVersionWhereInput>
    collections?: CollectionListRelationFilter
    componentStates?: ComponentStateListRelationFilter
    dataBindings?: DataBindingListRelationFilter
    dataEntities?: DataEntityListRelationFilter
    pageCompositions?: PageCompositionListRelationFilter
    snapshots?: SnapshotListRelationFilter
    storeStates?: StoreStateListRelationFilter
  }

  export type StoreOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    defaultLocale?: SortOrder
    defaultCurrency?: SortOrder
    themeId?: SortOrder
    themeVersionId?: SortOrder
    activePage?: SortOrder
    viewport?: SortOrder
    settingsJson?: SortOrder
    themeSettingsJson?: SortOrder
    brandingJson?: SortOrderInput | SortOrder
    isMaster?: SortOrder
    parentStoreId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    theme?: ThemeOrderByWithRelationInput
    themeVersion?: ThemeVersionOrderByWithRelationInput
    collections?: CollectionOrderByRelationAggregateInput
    componentStates?: ComponentStateOrderByRelationAggregateInput
    dataBindings?: DataBindingOrderByRelationAggregateInput
    dataEntities?: DataEntityOrderByRelationAggregateInput
    pageCompositions?: PageCompositionOrderByRelationAggregateInput
    snapshots?: SnapshotOrderByRelationAggregateInput
    storeStates?: StoreStateOrderByRelationAggregateInput
  }

  export type StoreWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StoreWhereInput | StoreWhereInput[]
    OR?: StoreWhereInput[]
    NOT?: StoreWhereInput | StoreWhereInput[]
    title?: StringFilter<"Store"> | string
    defaultLocale?: StringFilter<"Store"> | string
    defaultCurrency?: StringFilter<"Store"> | string
    themeId?: StringFilter<"Store"> | string
    themeVersionId?: StringFilter<"Store"> | string
    activePage?: StringFilter<"Store"> | string
    viewport?: StringFilter<"Store"> | string
    settingsJson?: StringFilter<"Store"> | string
    themeSettingsJson?: StringFilter<"Store"> | string
    brandingJson?: StringNullableFilter<"Store"> | string | null
    isMaster?: BoolFilter<"Store"> | boolean
    parentStoreId?: StringNullableFilter<"Store"> | string | null
    createdAt?: DateTimeFilter<"Store"> | Date | string
    updatedAt?: DateTimeFilter<"Store"> | Date | string
    theme?: XOR<ThemeRelationFilter, ThemeWhereInput>
    themeVersion?: XOR<ThemeVersionRelationFilter, ThemeVersionWhereInput>
    collections?: CollectionListRelationFilter
    componentStates?: ComponentStateListRelationFilter
    dataBindings?: DataBindingListRelationFilter
    dataEntities?: DataEntityListRelationFilter
    pageCompositions?: PageCompositionListRelationFilter
    snapshots?: SnapshotListRelationFilter
    storeStates?: StoreStateListRelationFilter
  }, "id">

  export type StoreOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    defaultLocale?: SortOrder
    defaultCurrency?: SortOrder
    themeId?: SortOrder
    themeVersionId?: SortOrder
    activePage?: SortOrder
    viewport?: SortOrder
    settingsJson?: SortOrder
    themeSettingsJson?: SortOrder
    brandingJson?: SortOrderInput | SortOrder
    isMaster?: SortOrder
    parentStoreId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: StoreCountOrderByAggregateInput
    _max?: StoreMaxOrderByAggregateInput
    _min?: StoreMinOrderByAggregateInput
  }

  export type StoreScalarWhereWithAggregatesInput = {
    AND?: StoreScalarWhereWithAggregatesInput | StoreScalarWhereWithAggregatesInput[]
    OR?: StoreScalarWhereWithAggregatesInput[]
    NOT?: StoreScalarWhereWithAggregatesInput | StoreScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Store"> | string
    title?: StringWithAggregatesFilter<"Store"> | string
    defaultLocale?: StringWithAggregatesFilter<"Store"> | string
    defaultCurrency?: StringWithAggregatesFilter<"Store"> | string
    themeId?: StringWithAggregatesFilter<"Store"> | string
    themeVersionId?: StringWithAggregatesFilter<"Store"> | string
    activePage?: StringWithAggregatesFilter<"Store"> | string
    viewport?: StringWithAggregatesFilter<"Store"> | string
    settingsJson?: StringWithAggregatesFilter<"Store"> | string
    themeSettingsJson?: StringWithAggregatesFilter<"Store"> | string
    brandingJson?: StringNullableWithAggregatesFilter<"Store"> | string | null
    isMaster?: BoolWithAggregatesFilter<"Store"> | boolean
    parentStoreId?: StringNullableWithAggregatesFilter<"Store"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Store"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Store"> | Date | string
  }

  export type StoreStateWhereInput = {
    AND?: StoreStateWhereInput | StoreStateWhereInput[]
    OR?: StoreStateWhereInput[]
    NOT?: StoreStateWhereInput | StoreStateWhereInput[]
    storeId?: StringFilter<"StoreState"> | string
    themeId?: StringFilter<"StoreState"> | string
    themeVersionId?: StringFilter<"StoreState"> | string
    activePage?: StringFilter<"StoreState"> | string
    viewport?: StringFilter<"StoreState"> | string
    settingsJson?: StringFilter<"StoreState"> | string
    updatedAt?: DateTimeFilter<"StoreState"> | Date | string
    themeVersion?: XOR<ThemeVersionRelationFilter, ThemeVersionWhereInput>
    theme?: XOR<ThemeRelationFilter, ThemeWhereInput>
    store?: XOR<StoreRelationFilter, StoreWhereInput>
  }

  export type StoreStateOrderByWithRelationInput = {
    storeId?: SortOrder
    themeId?: SortOrder
    themeVersionId?: SortOrder
    activePage?: SortOrder
    viewport?: SortOrder
    settingsJson?: SortOrder
    updatedAt?: SortOrder
    themeVersion?: ThemeVersionOrderByWithRelationInput
    theme?: ThemeOrderByWithRelationInput
    store?: StoreOrderByWithRelationInput
  }

  export type StoreStateWhereUniqueInput = Prisma.AtLeast<{
    storeId?: string
    AND?: StoreStateWhereInput | StoreStateWhereInput[]
    OR?: StoreStateWhereInput[]
    NOT?: StoreStateWhereInput | StoreStateWhereInput[]
    themeId?: StringFilter<"StoreState"> | string
    themeVersionId?: StringFilter<"StoreState"> | string
    activePage?: StringFilter<"StoreState"> | string
    viewport?: StringFilter<"StoreState"> | string
    settingsJson?: StringFilter<"StoreState"> | string
    updatedAt?: DateTimeFilter<"StoreState"> | Date | string
    themeVersion?: XOR<ThemeVersionRelationFilter, ThemeVersionWhereInput>
    theme?: XOR<ThemeRelationFilter, ThemeWhereInput>
    store?: XOR<StoreRelationFilter, StoreWhereInput>
  }, "storeId">

  export type StoreStateOrderByWithAggregationInput = {
    storeId?: SortOrder
    themeId?: SortOrder
    themeVersionId?: SortOrder
    activePage?: SortOrder
    viewport?: SortOrder
    settingsJson?: SortOrder
    updatedAt?: SortOrder
    _count?: StoreStateCountOrderByAggregateInput
    _max?: StoreStateMaxOrderByAggregateInput
    _min?: StoreStateMinOrderByAggregateInput
  }

  export type StoreStateScalarWhereWithAggregatesInput = {
    AND?: StoreStateScalarWhereWithAggregatesInput | StoreStateScalarWhereWithAggregatesInput[]
    OR?: StoreStateScalarWhereWithAggregatesInput[]
    NOT?: StoreStateScalarWhereWithAggregatesInput | StoreStateScalarWhereWithAggregatesInput[]
    storeId?: StringWithAggregatesFilter<"StoreState"> | string
    themeId?: StringWithAggregatesFilter<"StoreState"> | string
    themeVersionId?: StringWithAggregatesFilter<"StoreState"> | string
    activePage?: StringWithAggregatesFilter<"StoreState"> | string
    viewport?: StringWithAggregatesFilter<"StoreState"> | string
    settingsJson?: StringWithAggregatesFilter<"StoreState"> | string
    updatedAt?: DateTimeWithAggregatesFilter<"StoreState"> | Date | string
  }

  export type ComponentStateWhereInput = {
    AND?: ComponentStateWhereInput | ComponentStateWhereInput[]
    OR?: ComponentStateWhereInput[]
    NOT?: ComponentStateWhereInput | ComponentStateWhereInput[]
    id?: StringFilter<"ComponentState"> | string
    storeId?: StringFilter<"ComponentState"> | string
    componentPath?: StringFilter<"ComponentState"> | string
    componentKey?: StringNullableFilter<"ComponentState"> | string | null
    instanceOrder?: IntFilter<"ComponentState"> | number
    settingsJson?: StringFilter<"ComponentState"> | string
    visibilityJson?: StringNullableFilter<"ComponentState"> | string | null
    updatedAt?: DateTimeFilter<"ComponentState"> | Date | string
    store?: XOR<StoreRelationFilter, StoreWhereInput>
  }

  export type ComponentStateOrderByWithRelationInput = {
    id?: SortOrder
    storeId?: SortOrder
    componentPath?: SortOrder
    componentKey?: SortOrderInput | SortOrder
    instanceOrder?: SortOrder
    settingsJson?: SortOrder
    visibilityJson?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    store?: StoreOrderByWithRelationInput
  }

  export type ComponentStateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    storeId_componentPath_instanceOrder?: ComponentStateStoreIdComponentPathInstanceOrderCompoundUniqueInput
    AND?: ComponentStateWhereInput | ComponentStateWhereInput[]
    OR?: ComponentStateWhereInput[]
    NOT?: ComponentStateWhereInput | ComponentStateWhereInput[]
    storeId?: StringFilter<"ComponentState"> | string
    componentPath?: StringFilter<"ComponentState"> | string
    componentKey?: StringNullableFilter<"ComponentState"> | string | null
    instanceOrder?: IntFilter<"ComponentState"> | number
    settingsJson?: StringFilter<"ComponentState"> | string
    visibilityJson?: StringNullableFilter<"ComponentState"> | string | null
    updatedAt?: DateTimeFilter<"ComponentState"> | Date | string
    store?: XOR<StoreRelationFilter, StoreWhereInput>
  }, "id" | "storeId_componentPath_instanceOrder">

  export type ComponentStateOrderByWithAggregationInput = {
    id?: SortOrder
    storeId?: SortOrder
    componentPath?: SortOrder
    componentKey?: SortOrderInput | SortOrder
    instanceOrder?: SortOrder
    settingsJson?: SortOrder
    visibilityJson?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: ComponentStateCountOrderByAggregateInput
    _avg?: ComponentStateAvgOrderByAggregateInput
    _max?: ComponentStateMaxOrderByAggregateInput
    _min?: ComponentStateMinOrderByAggregateInput
    _sum?: ComponentStateSumOrderByAggregateInput
  }

  export type ComponentStateScalarWhereWithAggregatesInput = {
    AND?: ComponentStateScalarWhereWithAggregatesInput | ComponentStateScalarWhereWithAggregatesInput[]
    OR?: ComponentStateScalarWhereWithAggregatesInput[]
    NOT?: ComponentStateScalarWhereWithAggregatesInput | ComponentStateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ComponentState"> | string
    storeId?: StringWithAggregatesFilter<"ComponentState"> | string
    componentPath?: StringWithAggregatesFilter<"ComponentState"> | string
    componentKey?: StringNullableWithAggregatesFilter<"ComponentState"> | string | null
    instanceOrder?: IntWithAggregatesFilter<"ComponentState"> | number
    settingsJson?: StringWithAggregatesFilter<"ComponentState"> | string
    visibilityJson?: StringNullableWithAggregatesFilter<"ComponentState"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"ComponentState"> | Date | string
  }

  export type PageCompositionWhereInput = {
    AND?: PageCompositionWhereInput | PageCompositionWhereInput[]
    OR?: PageCompositionWhereInput[]
    NOT?: PageCompositionWhereInput | PageCompositionWhereInput[]
    id?: StringFilter<"PageComposition"> | string
    storeId?: StringFilter<"PageComposition"> | string
    page?: StringFilter<"PageComposition"> | string
    compositionJson?: StringFilter<"PageComposition"> | string
    updatedAt?: DateTimeFilter<"PageComposition"> | Date | string
    store?: XOR<StoreRelationFilter, StoreWhereInput>
  }

  export type PageCompositionOrderByWithRelationInput = {
    id?: SortOrder
    storeId?: SortOrder
    page?: SortOrder
    compositionJson?: SortOrder
    updatedAt?: SortOrder
    store?: StoreOrderByWithRelationInput
  }

  export type PageCompositionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    storeId_page?: PageCompositionStoreIdPageCompoundUniqueInput
    AND?: PageCompositionWhereInput | PageCompositionWhereInput[]
    OR?: PageCompositionWhereInput[]
    NOT?: PageCompositionWhereInput | PageCompositionWhereInput[]
    storeId?: StringFilter<"PageComposition"> | string
    page?: StringFilter<"PageComposition"> | string
    compositionJson?: StringFilter<"PageComposition"> | string
    updatedAt?: DateTimeFilter<"PageComposition"> | Date | string
    store?: XOR<StoreRelationFilter, StoreWhereInput>
  }, "id" | "storeId_page">

  export type PageCompositionOrderByWithAggregationInput = {
    id?: SortOrder
    storeId?: SortOrder
    page?: SortOrder
    compositionJson?: SortOrder
    updatedAt?: SortOrder
    _count?: PageCompositionCountOrderByAggregateInput
    _max?: PageCompositionMaxOrderByAggregateInput
    _min?: PageCompositionMinOrderByAggregateInput
  }

  export type PageCompositionScalarWhereWithAggregatesInput = {
    AND?: PageCompositionScalarWhereWithAggregatesInput | PageCompositionScalarWhereWithAggregatesInput[]
    OR?: PageCompositionScalarWhereWithAggregatesInput[]
    NOT?: PageCompositionScalarWhereWithAggregatesInput | PageCompositionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PageComposition"> | string
    storeId?: StringWithAggregatesFilter<"PageComposition"> | string
    page?: StringWithAggregatesFilter<"PageComposition"> | string
    compositionJson?: StringWithAggregatesFilter<"PageComposition"> | string
    updatedAt?: DateTimeWithAggregatesFilter<"PageComposition"> | Date | string
  }

  export type DataEntityWhereInput = {
    AND?: DataEntityWhereInput | DataEntityWhereInput[]
    OR?: DataEntityWhereInput[]
    NOT?: DataEntityWhereInput | DataEntityWhereInput[]
    id?: StringFilter<"DataEntity"> | string
    storeId?: StringFilter<"DataEntity"> | string
    entityType?: StringFilter<"DataEntity"> | string
    entityKey?: StringNullableFilter<"DataEntity"> | string | null
    payloadJson?: StringFilter<"DataEntity"> | string
    createdAt?: DateTimeFilter<"DataEntity"> | Date | string
    updatedAt?: DateTimeFilter<"DataEntity"> | Date | string
    store?: XOR<StoreRelationFilter, StoreWhereInput>
  }

  export type DataEntityOrderByWithRelationInput = {
    id?: SortOrder
    storeId?: SortOrder
    entityType?: SortOrder
    entityKey?: SortOrderInput | SortOrder
    payloadJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    store?: StoreOrderByWithRelationInput
  }

  export type DataEntityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    storeId_entityType_entityKey?: DataEntityStoreIdEntityTypeEntityKeyCompoundUniqueInput
    AND?: DataEntityWhereInput | DataEntityWhereInput[]
    OR?: DataEntityWhereInput[]
    NOT?: DataEntityWhereInput | DataEntityWhereInput[]
    storeId?: StringFilter<"DataEntity"> | string
    entityType?: StringFilter<"DataEntity"> | string
    entityKey?: StringNullableFilter<"DataEntity"> | string | null
    payloadJson?: StringFilter<"DataEntity"> | string
    createdAt?: DateTimeFilter<"DataEntity"> | Date | string
    updatedAt?: DateTimeFilter<"DataEntity"> | Date | string
    store?: XOR<StoreRelationFilter, StoreWhereInput>
  }, "id" | "storeId_entityType_entityKey">

  export type DataEntityOrderByWithAggregationInput = {
    id?: SortOrder
    storeId?: SortOrder
    entityType?: SortOrder
    entityKey?: SortOrderInput | SortOrder
    payloadJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DataEntityCountOrderByAggregateInput
    _max?: DataEntityMaxOrderByAggregateInput
    _min?: DataEntityMinOrderByAggregateInput
  }

  export type DataEntityScalarWhereWithAggregatesInput = {
    AND?: DataEntityScalarWhereWithAggregatesInput | DataEntityScalarWhereWithAggregatesInput[]
    OR?: DataEntityScalarWhereWithAggregatesInput[]
    NOT?: DataEntityScalarWhereWithAggregatesInput | DataEntityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DataEntity"> | string
    storeId?: StringWithAggregatesFilter<"DataEntity"> | string
    entityType?: StringWithAggregatesFilter<"DataEntity"> | string
    entityKey?: StringNullableWithAggregatesFilter<"DataEntity"> | string | null
    payloadJson?: StringWithAggregatesFilter<"DataEntity"> | string
    createdAt?: DateTimeWithAggregatesFilter<"DataEntity"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DataEntity"> | Date | string
  }

  export type CollectionWhereInput = {
    AND?: CollectionWhereInput | CollectionWhereInput[]
    OR?: CollectionWhereInput[]
    NOT?: CollectionWhereInput | CollectionWhereInput[]
    id?: StringFilter<"Collection"> | string
    storeId?: StringFilter<"Collection"> | string
    name?: StringFilter<"Collection"> | string
    source?: StringFilter<"Collection"> | string
    rulesJson?: StringNullableFilter<"Collection"> | string | null
    createdAt?: DateTimeFilter<"Collection"> | Date | string
    updatedAt?: DateTimeFilter<"Collection"> | Date | string
    store?: XOR<StoreRelationFilter, StoreWhereInput>
    items?: CollectionItemListRelationFilter
  }

  export type CollectionOrderByWithRelationInput = {
    id?: SortOrder
    storeId?: SortOrder
    name?: SortOrder
    source?: SortOrder
    rulesJson?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    store?: StoreOrderByWithRelationInput
    items?: CollectionItemOrderByRelationAggregateInput
  }

  export type CollectionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CollectionWhereInput | CollectionWhereInput[]
    OR?: CollectionWhereInput[]
    NOT?: CollectionWhereInput | CollectionWhereInput[]
    storeId?: StringFilter<"Collection"> | string
    name?: StringFilter<"Collection"> | string
    source?: StringFilter<"Collection"> | string
    rulesJson?: StringNullableFilter<"Collection"> | string | null
    createdAt?: DateTimeFilter<"Collection"> | Date | string
    updatedAt?: DateTimeFilter<"Collection"> | Date | string
    store?: XOR<StoreRelationFilter, StoreWhereInput>
    items?: CollectionItemListRelationFilter
  }, "id">

  export type CollectionOrderByWithAggregationInput = {
    id?: SortOrder
    storeId?: SortOrder
    name?: SortOrder
    source?: SortOrder
    rulesJson?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CollectionCountOrderByAggregateInput
    _max?: CollectionMaxOrderByAggregateInput
    _min?: CollectionMinOrderByAggregateInput
  }

  export type CollectionScalarWhereWithAggregatesInput = {
    AND?: CollectionScalarWhereWithAggregatesInput | CollectionScalarWhereWithAggregatesInput[]
    OR?: CollectionScalarWhereWithAggregatesInput[]
    NOT?: CollectionScalarWhereWithAggregatesInput | CollectionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Collection"> | string
    storeId?: StringWithAggregatesFilter<"Collection"> | string
    name?: StringWithAggregatesFilter<"Collection"> | string
    source?: StringWithAggregatesFilter<"Collection"> | string
    rulesJson?: StringNullableWithAggregatesFilter<"Collection"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Collection"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Collection"> | Date | string
  }

  export type CollectionItemWhereInput = {
    AND?: CollectionItemWhereInput | CollectionItemWhereInput[]
    OR?: CollectionItemWhereInput[]
    NOT?: CollectionItemWhereInput | CollectionItemWhereInput[]
    collectionId?: StringFilter<"CollectionItem"> | string
    entityId?: StringFilter<"CollectionItem"> | string
    sortOrder?: IntFilter<"CollectionItem"> | number
    collection?: XOR<CollectionRelationFilter, CollectionWhereInput>
  }

  export type CollectionItemOrderByWithRelationInput = {
    collectionId?: SortOrder
    entityId?: SortOrder
    sortOrder?: SortOrder
    collection?: CollectionOrderByWithRelationInput
  }

  export type CollectionItemWhereUniqueInput = Prisma.AtLeast<{
    collectionId_entityId?: CollectionItemCollectionIdEntityIdCompoundUniqueInput
    AND?: CollectionItemWhereInput | CollectionItemWhereInput[]
    OR?: CollectionItemWhereInput[]
    NOT?: CollectionItemWhereInput | CollectionItemWhereInput[]
    collectionId?: StringFilter<"CollectionItem"> | string
    entityId?: StringFilter<"CollectionItem"> | string
    sortOrder?: IntFilter<"CollectionItem"> | number
    collection?: XOR<CollectionRelationFilter, CollectionWhereInput>
  }, "collectionId_entityId">

  export type CollectionItemOrderByWithAggregationInput = {
    collectionId?: SortOrder
    entityId?: SortOrder
    sortOrder?: SortOrder
    _count?: CollectionItemCountOrderByAggregateInput
    _avg?: CollectionItemAvgOrderByAggregateInput
    _max?: CollectionItemMaxOrderByAggregateInput
    _min?: CollectionItemMinOrderByAggregateInput
    _sum?: CollectionItemSumOrderByAggregateInput
  }

  export type CollectionItemScalarWhereWithAggregatesInput = {
    AND?: CollectionItemScalarWhereWithAggregatesInput | CollectionItemScalarWhereWithAggregatesInput[]
    OR?: CollectionItemScalarWhereWithAggregatesInput[]
    NOT?: CollectionItemScalarWhereWithAggregatesInput | CollectionItemScalarWhereWithAggregatesInput[]
    collectionId?: StringWithAggregatesFilter<"CollectionItem"> | string
    entityId?: StringWithAggregatesFilter<"CollectionItem"> | string
    sortOrder?: IntWithAggregatesFilter<"CollectionItem"> | number
  }

  export type DataBindingWhereInput = {
    AND?: DataBindingWhereInput | DataBindingWhereInput[]
    OR?: DataBindingWhereInput[]
    NOT?: DataBindingWhereInput | DataBindingWhereInput[]
    id?: StringFilter<"DataBinding"> | string
    storeId?: StringFilter<"DataBinding"> | string
    componentPath?: StringFilter<"DataBinding"> | string
    bindingKey?: StringFilter<"DataBinding"> | string
    sourceType?: StringFilter<"DataBinding"> | string
    sourceRef?: StringFilter<"DataBinding"> | string
    bindingJson?: StringNullableFilter<"DataBinding"> | string | null
    updatedAt?: DateTimeFilter<"DataBinding"> | Date | string
    store?: XOR<StoreRelationFilter, StoreWhereInput>
  }

  export type DataBindingOrderByWithRelationInput = {
    id?: SortOrder
    storeId?: SortOrder
    componentPath?: SortOrder
    bindingKey?: SortOrder
    sourceType?: SortOrder
    sourceRef?: SortOrder
    bindingJson?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    store?: StoreOrderByWithRelationInput
  }

  export type DataBindingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DataBindingWhereInput | DataBindingWhereInput[]
    OR?: DataBindingWhereInput[]
    NOT?: DataBindingWhereInput | DataBindingWhereInput[]
    storeId?: StringFilter<"DataBinding"> | string
    componentPath?: StringFilter<"DataBinding"> | string
    bindingKey?: StringFilter<"DataBinding"> | string
    sourceType?: StringFilter<"DataBinding"> | string
    sourceRef?: StringFilter<"DataBinding"> | string
    bindingJson?: StringNullableFilter<"DataBinding"> | string | null
    updatedAt?: DateTimeFilter<"DataBinding"> | Date | string
    store?: XOR<StoreRelationFilter, StoreWhereInput>
  }, "id">

  export type DataBindingOrderByWithAggregationInput = {
    id?: SortOrder
    storeId?: SortOrder
    componentPath?: SortOrder
    bindingKey?: SortOrder
    sourceType?: SortOrder
    sourceRef?: SortOrder
    bindingJson?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: DataBindingCountOrderByAggregateInput
    _max?: DataBindingMaxOrderByAggregateInput
    _min?: DataBindingMinOrderByAggregateInput
  }

  export type DataBindingScalarWhereWithAggregatesInput = {
    AND?: DataBindingScalarWhereWithAggregatesInput | DataBindingScalarWhereWithAggregatesInput[]
    OR?: DataBindingScalarWhereWithAggregatesInput[]
    NOT?: DataBindingScalarWhereWithAggregatesInput | DataBindingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DataBinding"> | string
    storeId?: StringWithAggregatesFilter<"DataBinding"> | string
    componentPath?: StringWithAggregatesFilter<"DataBinding"> | string
    bindingKey?: StringWithAggregatesFilter<"DataBinding"> | string
    sourceType?: StringWithAggregatesFilter<"DataBinding"> | string
    sourceRef?: StringWithAggregatesFilter<"DataBinding"> | string
    bindingJson?: StringNullableWithAggregatesFilter<"DataBinding"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"DataBinding"> | Date | string
  }

  export type SnapshotWhereInput = {
    AND?: SnapshotWhereInput | SnapshotWhereInput[]
    OR?: SnapshotWhereInput[]
    NOT?: SnapshotWhereInput | SnapshotWhereInput[]
    id?: StringFilter<"Snapshot"> | string
    storeId?: StringFilter<"Snapshot"> | string
    label?: StringFilter<"Snapshot"> | string
    snapshotJson?: StringFilter<"Snapshot"> | string
    createdAt?: DateTimeFilter<"Snapshot"> | Date | string
    store?: XOR<StoreRelationFilter, StoreWhereInput>
  }

  export type SnapshotOrderByWithRelationInput = {
    id?: SortOrder
    storeId?: SortOrder
    label?: SortOrder
    snapshotJson?: SortOrder
    createdAt?: SortOrder
    store?: StoreOrderByWithRelationInput
  }

  export type SnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SnapshotWhereInput | SnapshotWhereInput[]
    OR?: SnapshotWhereInput[]
    NOT?: SnapshotWhereInput | SnapshotWhereInput[]
    storeId?: StringFilter<"Snapshot"> | string
    label?: StringFilter<"Snapshot"> | string
    snapshotJson?: StringFilter<"Snapshot"> | string
    createdAt?: DateTimeFilter<"Snapshot"> | Date | string
    store?: XOR<StoreRelationFilter, StoreWhereInput>
  }, "id">

  export type SnapshotOrderByWithAggregationInput = {
    id?: SortOrder
    storeId?: SortOrder
    label?: SortOrder
    snapshotJson?: SortOrder
    createdAt?: SortOrder
    _count?: SnapshotCountOrderByAggregateInput
    _max?: SnapshotMaxOrderByAggregateInput
    _min?: SnapshotMinOrderByAggregateInput
  }

  export type SnapshotScalarWhereWithAggregatesInput = {
    AND?: SnapshotScalarWhereWithAggregatesInput | SnapshotScalarWhereWithAggregatesInput[]
    OR?: SnapshotScalarWhereWithAggregatesInput[]
    NOT?: SnapshotScalarWhereWithAggregatesInput | SnapshotScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Snapshot"> | string
    storeId?: StringWithAggregatesFilter<"Snapshot"> | string
    label?: StringWithAggregatesFilter<"Snapshot"> | string
    snapshotJson?: StringWithAggregatesFilter<"Snapshot"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Snapshot"> | Date | string
  }

  export type ThemeCreateInput = {
    id: string
    nameAr?: string | null
    nameEn?: string | null
    repository?: string | null
    authorEmail?: string | null
    supportUrl?: string | null
    descriptionAr?: string | null
    descriptionEn?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeStates?: StoreStateCreateNestedManyWithoutThemeInput
    versions?: ThemeVersionCreateNestedManyWithoutThemeInput
    stores?: StoreCreateNestedManyWithoutThemeInput
  }

  export type ThemeUncheckedCreateInput = {
    id: string
    nameAr?: string | null
    nameEn?: string | null
    repository?: string | null
    authorEmail?: string | null
    supportUrl?: string | null
    descriptionAr?: string | null
    descriptionEn?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeStates?: StoreStateUncheckedCreateNestedManyWithoutThemeInput
    versions?: ThemeVersionUncheckedCreateNestedManyWithoutThemeInput
    stores?: StoreUncheckedCreateNestedManyWithoutThemeInput
  }

  export type ThemeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    nameEn?: NullableStringFieldUpdateOperationsInput | string | null
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    authorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    supportUrl?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionAr?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionEn?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeStates?: StoreStateUpdateManyWithoutThemeNestedInput
    versions?: ThemeVersionUpdateManyWithoutThemeNestedInput
    stores?: StoreUpdateManyWithoutThemeNestedInput
  }

  export type ThemeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    nameEn?: NullableStringFieldUpdateOperationsInput | string | null
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    authorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    supportUrl?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionAr?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionEn?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeStates?: StoreStateUncheckedUpdateManyWithoutThemeNestedInput
    versions?: ThemeVersionUncheckedUpdateManyWithoutThemeNestedInput
    stores?: StoreUncheckedUpdateManyWithoutThemeNestedInput
  }

  export type ThemeCreateManyInput = {
    id: string
    nameAr?: string | null
    nameEn?: string | null
    repository?: string | null
    authorEmail?: string | null
    supportUrl?: string | null
    descriptionAr?: string | null
    descriptionEn?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ThemeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    nameEn?: NullableStringFieldUpdateOperationsInput | string | null
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    authorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    supportUrl?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionAr?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionEn?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThemeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    nameEn?: NullableStringFieldUpdateOperationsInput | string | null
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    authorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    supportUrl?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionAr?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionEn?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThemeVersionCreateInput = {
    id?: string
    version: string
    fsPath: string
    contractJson: string
    capabilitiesJson?: string | null
    schemaHash?: string | null
    createdAt?: Date | string
    storeStates?: StoreStateCreateNestedManyWithoutThemeVersionInput
    theme: ThemeCreateNestedOneWithoutVersionsInput
    stores?: StoreCreateNestedManyWithoutThemeVersionInput
  }

  export type ThemeVersionUncheckedCreateInput = {
    id?: string
    themeId: string
    version: string
    fsPath: string
    contractJson: string
    capabilitiesJson?: string | null
    schemaHash?: string | null
    createdAt?: Date | string
    storeStates?: StoreStateUncheckedCreateNestedManyWithoutThemeVersionInput
    stores?: StoreUncheckedCreateNestedManyWithoutThemeVersionInput
  }

  export type ThemeVersionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    fsPath?: StringFieldUpdateOperationsInput | string
    contractJson?: StringFieldUpdateOperationsInput | string
    capabilitiesJson?: NullableStringFieldUpdateOperationsInput | string | null
    schemaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeStates?: StoreStateUpdateManyWithoutThemeVersionNestedInput
    theme?: ThemeUpdateOneRequiredWithoutVersionsNestedInput
    stores?: StoreUpdateManyWithoutThemeVersionNestedInput
  }

  export type ThemeVersionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    fsPath?: StringFieldUpdateOperationsInput | string
    contractJson?: StringFieldUpdateOperationsInput | string
    capabilitiesJson?: NullableStringFieldUpdateOperationsInput | string | null
    schemaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeStates?: StoreStateUncheckedUpdateManyWithoutThemeVersionNestedInput
    stores?: StoreUncheckedUpdateManyWithoutThemeVersionNestedInput
  }

  export type ThemeVersionCreateManyInput = {
    id?: string
    themeId: string
    version: string
    fsPath: string
    contractJson: string
    capabilitiesJson?: string | null
    schemaHash?: string | null
    createdAt?: Date | string
  }

  export type ThemeVersionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    fsPath?: StringFieldUpdateOperationsInput | string
    contractJson?: StringFieldUpdateOperationsInput | string
    capabilitiesJson?: NullableStringFieldUpdateOperationsInput | string | null
    schemaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThemeVersionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    fsPath?: StringFieldUpdateOperationsInput | string
    contractJson?: StringFieldUpdateOperationsInput | string
    capabilitiesJson?: NullableStringFieldUpdateOperationsInput | string | null
    schemaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreCreateInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    theme: ThemeCreateNestedOneWithoutStoresInput
    themeVersion: ThemeVersionCreateNestedOneWithoutStoresInput
    collections?: CollectionCreateNestedManyWithoutStoreInput
    componentStates?: ComponentStateCreateNestedManyWithoutStoreInput
    dataBindings?: DataBindingCreateNestedManyWithoutStoreInput
    dataEntities?: DataEntityCreateNestedManyWithoutStoreInput
    pageCompositions?: PageCompositionCreateNestedManyWithoutStoreInput
    snapshots?: SnapshotCreateNestedManyWithoutStoreInput
    storeStates?: StoreStateCreateNestedManyWithoutStoreInput
  }

  export type StoreUncheckedCreateInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    themeId: string
    themeVersionId: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    collections?: CollectionUncheckedCreateNestedManyWithoutStoreInput
    componentStates?: ComponentStateUncheckedCreateNestedManyWithoutStoreInput
    dataBindings?: DataBindingUncheckedCreateNestedManyWithoutStoreInput
    dataEntities?: DataEntityUncheckedCreateNestedManyWithoutStoreInput
    pageCompositions?: PageCompositionUncheckedCreateNestedManyWithoutStoreInput
    snapshots?: SnapshotUncheckedCreateNestedManyWithoutStoreInput
    storeStates?: StoreStateUncheckedCreateNestedManyWithoutStoreInput
  }

  export type StoreUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    theme?: ThemeUpdateOneRequiredWithoutStoresNestedInput
    themeVersion?: ThemeVersionUpdateOneRequiredWithoutStoresNestedInput
    collections?: CollectionUpdateManyWithoutStoreNestedInput
    componentStates?: ComponentStateUpdateManyWithoutStoreNestedInput
    dataBindings?: DataBindingUpdateManyWithoutStoreNestedInput
    dataEntities?: DataEntityUpdateManyWithoutStoreNestedInput
    pageCompositions?: PageCompositionUpdateManyWithoutStoreNestedInput
    snapshots?: SnapshotUpdateManyWithoutStoreNestedInput
    storeStates?: StoreStateUpdateManyWithoutStoreNestedInput
  }

  export type StoreUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    themeVersionId?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collections?: CollectionUncheckedUpdateManyWithoutStoreNestedInput
    componentStates?: ComponentStateUncheckedUpdateManyWithoutStoreNestedInput
    dataBindings?: DataBindingUncheckedUpdateManyWithoutStoreNestedInput
    dataEntities?: DataEntityUncheckedUpdateManyWithoutStoreNestedInput
    pageCompositions?: PageCompositionUncheckedUpdateManyWithoutStoreNestedInput
    snapshots?: SnapshotUncheckedUpdateManyWithoutStoreNestedInput
    storeStates?: StoreStateUncheckedUpdateManyWithoutStoreNestedInput
  }

  export type StoreCreateManyInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    themeId: string
    themeVersionId: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StoreUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    themeVersionId?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreStateCreateInput = {
    activePage?: string
    viewport?: string
    settingsJson: string
    updatedAt?: Date | string
    themeVersion: ThemeVersionCreateNestedOneWithoutStoreStatesInput
    theme: ThemeCreateNestedOneWithoutStoreStatesInput
    store: StoreCreateNestedOneWithoutStoreStatesInput
  }

  export type StoreStateUncheckedCreateInput = {
    storeId: string
    themeId: string
    themeVersionId: string
    activePage?: string
    viewport?: string
    settingsJson: string
    updatedAt?: Date | string
  }

  export type StoreStateUpdateInput = {
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    themeVersion?: ThemeVersionUpdateOneRequiredWithoutStoreStatesNestedInput
    theme?: ThemeUpdateOneRequiredWithoutStoreStatesNestedInput
    store?: StoreUpdateOneRequiredWithoutStoreStatesNestedInput
  }

  export type StoreStateUncheckedUpdateInput = {
    storeId?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    themeVersionId?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreStateCreateManyInput = {
    storeId: string
    themeId: string
    themeVersionId: string
    activePage?: string
    viewport?: string
    settingsJson: string
    updatedAt?: Date | string
  }

  export type StoreStateUpdateManyMutationInput = {
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreStateUncheckedUpdateManyInput = {
    storeId?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    themeVersionId?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ComponentStateCreateInput = {
    id?: string
    componentPath: string
    componentKey?: string | null
    instanceOrder: number
    settingsJson: string
    visibilityJson?: string | null
    updatedAt?: Date | string
    store: StoreCreateNestedOneWithoutComponentStatesInput
  }

  export type ComponentStateUncheckedCreateInput = {
    id?: string
    storeId: string
    componentPath: string
    componentKey?: string | null
    instanceOrder: number
    settingsJson: string
    visibilityJson?: string | null
    updatedAt?: Date | string
  }

  export type ComponentStateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    componentPath?: StringFieldUpdateOperationsInput | string
    componentKey?: NullableStringFieldUpdateOperationsInput | string | null
    instanceOrder?: IntFieldUpdateOperationsInput | number
    settingsJson?: StringFieldUpdateOperationsInput | string
    visibilityJson?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    store?: StoreUpdateOneRequiredWithoutComponentStatesNestedInput
  }

  export type ComponentStateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    componentPath?: StringFieldUpdateOperationsInput | string
    componentKey?: NullableStringFieldUpdateOperationsInput | string | null
    instanceOrder?: IntFieldUpdateOperationsInput | number
    settingsJson?: StringFieldUpdateOperationsInput | string
    visibilityJson?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ComponentStateCreateManyInput = {
    id?: string
    storeId: string
    componentPath: string
    componentKey?: string | null
    instanceOrder: number
    settingsJson: string
    visibilityJson?: string | null
    updatedAt?: Date | string
  }

  export type ComponentStateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    componentPath?: StringFieldUpdateOperationsInput | string
    componentKey?: NullableStringFieldUpdateOperationsInput | string | null
    instanceOrder?: IntFieldUpdateOperationsInput | number
    settingsJson?: StringFieldUpdateOperationsInput | string
    visibilityJson?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ComponentStateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    componentPath?: StringFieldUpdateOperationsInput | string
    componentKey?: NullableStringFieldUpdateOperationsInput | string | null
    instanceOrder?: IntFieldUpdateOperationsInput | number
    settingsJson?: StringFieldUpdateOperationsInput | string
    visibilityJson?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PageCompositionCreateInput = {
    id?: string
    page: string
    compositionJson: string
    updatedAt?: Date | string
    store: StoreCreateNestedOneWithoutPageCompositionsInput
  }

  export type PageCompositionUncheckedCreateInput = {
    id?: string
    storeId: string
    page: string
    compositionJson: string
    updatedAt?: Date | string
  }

  export type PageCompositionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    page?: StringFieldUpdateOperationsInput | string
    compositionJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    store?: StoreUpdateOneRequiredWithoutPageCompositionsNestedInput
  }

  export type PageCompositionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    page?: StringFieldUpdateOperationsInput | string
    compositionJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PageCompositionCreateManyInput = {
    id?: string
    storeId: string
    page: string
    compositionJson: string
    updatedAt?: Date | string
  }

  export type PageCompositionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    page?: StringFieldUpdateOperationsInput | string
    compositionJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PageCompositionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    page?: StringFieldUpdateOperationsInput | string
    compositionJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataEntityCreateInput = {
    id?: string
    entityType: string
    entityKey?: string | null
    payloadJson: string
    createdAt?: Date | string
    updatedAt?: Date | string
    store: StoreCreateNestedOneWithoutDataEntitiesInput
  }

  export type DataEntityUncheckedCreateInput = {
    id?: string
    storeId: string
    entityType: string
    entityKey?: string | null
    payloadJson: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DataEntityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityKey?: NullableStringFieldUpdateOperationsInput | string | null
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    store?: StoreUpdateOneRequiredWithoutDataEntitiesNestedInput
  }

  export type DataEntityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityKey?: NullableStringFieldUpdateOperationsInput | string | null
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataEntityCreateManyInput = {
    id?: string
    storeId: string
    entityType: string
    entityKey?: string | null
    payloadJson: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DataEntityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityKey?: NullableStringFieldUpdateOperationsInput | string | null
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataEntityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityKey?: NullableStringFieldUpdateOperationsInput | string | null
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollectionCreateInput = {
    id?: string
    name: string
    source: string
    rulesJson?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    store: StoreCreateNestedOneWithoutCollectionsInput
    items?: CollectionItemCreateNestedManyWithoutCollectionInput
  }

  export type CollectionUncheckedCreateInput = {
    id?: string
    storeId: string
    name: string
    source: string
    rulesJson?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: CollectionItemUncheckedCreateNestedManyWithoutCollectionInput
  }

  export type CollectionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    rulesJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    store?: StoreUpdateOneRequiredWithoutCollectionsNestedInput
    items?: CollectionItemUpdateManyWithoutCollectionNestedInput
  }

  export type CollectionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    rulesJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: CollectionItemUncheckedUpdateManyWithoutCollectionNestedInput
  }

  export type CollectionCreateManyInput = {
    id?: string
    storeId: string
    name: string
    source: string
    rulesJson?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CollectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    rulesJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollectionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    rulesJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollectionItemCreateInput = {
    entityId: string
    sortOrder: number
    collection: CollectionCreateNestedOneWithoutItemsInput
  }

  export type CollectionItemUncheckedCreateInput = {
    collectionId: string
    entityId: string
    sortOrder: number
  }

  export type CollectionItemUpdateInput = {
    entityId?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    collection?: CollectionUpdateOneRequiredWithoutItemsNestedInput
  }

  export type CollectionItemUncheckedUpdateInput = {
    collectionId?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type CollectionItemCreateManyInput = {
    collectionId: string
    entityId: string
    sortOrder: number
  }

  export type CollectionItemUpdateManyMutationInput = {
    entityId?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type CollectionItemUncheckedUpdateManyInput = {
    collectionId?: StringFieldUpdateOperationsInput | string
    entityId?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type DataBindingCreateInput = {
    id?: string
    componentPath: string
    bindingKey: string
    sourceType: string
    sourceRef: string
    bindingJson?: string | null
    updatedAt?: Date | string
    store: StoreCreateNestedOneWithoutDataBindingsInput
  }

  export type DataBindingUncheckedCreateInput = {
    id?: string
    storeId: string
    componentPath: string
    bindingKey: string
    sourceType: string
    sourceRef: string
    bindingJson?: string | null
    updatedAt?: Date | string
  }

  export type DataBindingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    componentPath?: StringFieldUpdateOperationsInput | string
    bindingKey?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceRef?: StringFieldUpdateOperationsInput | string
    bindingJson?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    store?: StoreUpdateOneRequiredWithoutDataBindingsNestedInput
  }

  export type DataBindingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    componentPath?: StringFieldUpdateOperationsInput | string
    bindingKey?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceRef?: StringFieldUpdateOperationsInput | string
    bindingJson?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataBindingCreateManyInput = {
    id?: string
    storeId: string
    componentPath: string
    bindingKey: string
    sourceType: string
    sourceRef: string
    bindingJson?: string | null
    updatedAt?: Date | string
  }

  export type DataBindingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    componentPath?: StringFieldUpdateOperationsInput | string
    bindingKey?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceRef?: StringFieldUpdateOperationsInput | string
    bindingJson?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataBindingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    componentPath?: StringFieldUpdateOperationsInput | string
    bindingKey?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceRef?: StringFieldUpdateOperationsInput | string
    bindingJson?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapshotCreateInput = {
    id?: string
    label: string
    snapshotJson: string
    createdAt?: Date | string
    store: StoreCreateNestedOneWithoutSnapshotsInput
  }

  export type SnapshotUncheckedCreateInput = {
    id?: string
    storeId: string
    label: string
    snapshotJson: string
    createdAt?: Date | string
  }

  export type SnapshotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    store?: StoreUpdateOneRequiredWithoutSnapshotsNestedInput
  }

  export type SnapshotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapshotCreateManyInput = {
    id?: string
    storeId: string
    label: string
    snapshotJson: string
    createdAt?: Date | string
  }

  export type SnapshotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapshotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StoreStateListRelationFilter = {
    every?: StoreStateWhereInput
    some?: StoreStateWhereInput
    none?: StoreStateWhereInput
  }

  export type ThemeVersionListRelationFilter = {
    every?: ThemeVersionWhereInput
    some?: ThemeVersionWhereInput
    none?: ThemeVersionWhereInput
  }

  export type StoreListRelationFilter = {
    every?: StoreWhereInput
    some?: StoreWhereInput
    none?: StoreWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type StoreStateOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ThemeVersionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StoreOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ThemeCountOrderByAggregateInput = {
    id?: SortOrder
    nameAr?: SortOrder
    nameEn?: SortOrder
    repository?: SortOrder
    authorEmail?: SortOrder
    supportUrl?: SortOrder
    descriptionAr?: SortOrder
    descriptionEn?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ThemeMaxOrderByAggregateInput = {
    id?: SortOrder
    nameAr?: SortOrder
    nameEn?: SortOrder
    repository?: SortOrder
    authorEmail?: SortOrder
    supportUrl?: SortOrder
    descriptionAr?: SortOrder
    descriptionEn?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ThemeMinOrderByAggregateInput = {
    id?: SortOrder
    nameAr?: SortOrder
    nameEn?: SortOrder
    repository?: SortOrder
    authorEmail?: SortOrder
    supportUrl?: SortOrder
    descriptionAr?: SortOrder
    descriptionEn?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type ThemeRelationFilter = {
    is?: ThemeWhereInput
    isNot?: ThemeWhereInput
  }

  export type ThemeVersionThemeIdVersionCompoundUniqueInput = {
    themeId: string
    version: string
  }

  export type ThemeVersionCountOrderByAggregateInput = {
    id?: SortOrder
    themeId?: SortOrder
    version?: SortOrder
    fsPath?: SortOrder
    contractJson?: SortOrder
    capabilitiesJson?: SortOrder
    schemaHash?: SortOrder
    createdAt?: SortOrder
  }

  export type ThemeVersionMaxOrderByAggregateInput = {
    id?: SortOrder
    themeId?: SortOrder
    version?: SortOrder
    fsPath?: SortOrder
    contractJson?: SortOrder
    capabilitiesJson?: SortOrder
    schemaHash?: SortOrder
    createdAt?: SortOrder
  }

  export type ThemeVersionMinOrderByAggregateInput = {
    id?: SortOrder
    themeId?: SortOrder
    version?: SortOrder
    fsPath?: SortOrder
    contractJson?: SortOrder
    capabilitiesJson?: SortOrder
    schemaHash?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ThemeVersionRelationFilter = {
    is?: ThemeVersionWhereInput
    isNot?: ThemeVersionWhereInput
  }

  export type CollectionListRelationFilter = {
    every?: CollectionWhereInput
    some?: CollectionWhereInput
    none?: CollectionWhereInput
  }

  export type ComponentStateListRelationFilter = {
    every?: ComponentStateWhereInput
    some?: ComponentStateWhereInput
    none?: ComponentStateWhereInput
  }

  export type DataBindingListRelationFilter = {
    every?: DataBindingWhereInput
    some?: DataBindingWhereInput
    none?: DataBindingWhereInput
  }

  export type DataEntityListRelationFilter = {
    every?: DataEntityWhereInput
    some?: DataEntityWhereInput
    none?: DataEntityWhereInput
  }

  export type PageCompositionListRelationFilter = {
    every?: PageCompositionWhereInput
    some?: PageCompositionWhereInput
    none?: PageCompositionWhereInput
  }

  export type SnapshotListRelationFilter = {
    every?: SnapshotWhereInput
    some?: SnapshotWhereInput
    none?: SnapshotWhereInput
  }

  export type CollectionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ComponentStateOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DataBindingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DataEntityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PageCompositionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SnapshotOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StoreCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    defaultLocale?: SortOrder
    defaultCurrency?: SortOrder
    themeId?: SortOrder
    themeVersionId?: SortOrder
    activePage?: SortOrder
    viewport?: SortOrder
    settingsJson?: SortOrder
    themeSettingsJson?: SortOrder
    brandingJson?: SortOrder
    isMaster?: SortOrder
    parentStoreId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StoreMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    defaultLocale?: SortOrder
    defaultCurrency?: SortOrder
    themeId?: SortOrder
    themeVersionId?: SortOrder
    activePage?: SortOrder
    viewport?: SortOrder
    settingsJson?: SortOrder
    themeSettingsJson?: SortOrder
    brandingJson?: SortOrder
    isMaster?: SortOrder
    parentStoreId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StoreMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    defaultLocale?: SortOrder
    defaultCurrency?: SortOrder
    themeId?: SortOrder
    themeVersionId?: SortOrder
    activePage?: SortOrder
    viewport?: SortOrder
    settingsJson?: SortOrder
    themeSettingsJson?: SortOrder
    brandingJson?: SortOrder
    isMaster?: SortOrder
    parentStoreId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StoreRelationFilter = {
    is?: StoreWhereInput
    isNot?: StoreWhereInput
  }

  export type StoreStateCountOrderByAggregateInput = {
    storeId?: SortOrder
    themeId?: SortOrder
    themeVersionId?: SortOrder
    activePage?: SortOrder
    viewport?: SortOrder
    settingsJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type StoreStateMaxOrderByAggregateInput = {
    storeId?: SortOrder
    themeId?: SortOrder
    themeVersionId?: SortOrder
    activePage?: SortOrder
    viewport?: SortOrder
    settingsJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type StoreStateMinOrderByAggregateInput = {
    storeId?: SortOrder
    themeId?: SortOrder
    themeVersionId?: SortOrder
    activePage?: SortOrder
    viewport?: SortOrder
    settingsJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type ComponentStateStoreIdComponentPathInstanceOrderCompoundUniqueInput = {
    storeId: string
    componentPath: string
    instanceOrder: number
  }

  export type ComponentStateCountOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    componentPath?: SortOrder
    componentKey?: SortOrder
    instanceOrder?: SortOrder
    settingsJson?: SortOrder
    visibilityJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type ComponentStateAvgOrderByAggregateInput = {
    instanceOrder?: SortOrder
  }

  export type ComponentStateMaxOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    componentPath?: SortOrder
    componentKey?: SortOrder
    instanceOrder?: SortOrder
    settingsJson?: SortOrder
    visibilityJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type ComponentStateMinOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    componentPath?: SortOrder
    componentKey?: SortOrder
    instanceOrder?: SortOrder
    settingsJson?: SortOrder
    visibilityJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type ComponentStateSumOrderByAggregateInput = {
    instanceOrder?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type PageCompositionStoreIdPageCompoundUniqueInput = {
    storeId: string
    page: string
  }

  export type PageCompositionCountOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    page?: SortOrder
    compositionJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type PageCompositionMaxOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    page?: SortOrder
    compositionJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type PageCompositionMinOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    page?: SortOrder
    compositionJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type DataEntityStoreIdEntityTypeEntityKeyCompoundUniqueInput = {
    storeId: string
    entityType: string
    entityKey: string
  }

  export type DataEntityCountOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    entityType?: SortOrder
    entityKey?: SortOrder
    payloadJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DataEntityMaxOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    entityType?: SortOrder
    entityKey?: SortOrder
    payloadJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DataEntityMinOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    entityType?: SortOrder
    entityKey?: SortOrder
    payloadJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CollectionItemListRelationFilter = {
    every?: CollectionItemWhereInput
    some?: CollectionItemWhereInput
    none?: CollectionItemWhereInput
  }

  export type CollectionItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CollectionCountOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    name?: SortOrder
    source?: SortOrder
    rulesJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CollectionMaxOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    name?: SortOrder
    source?: SortOrder
    rulesJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CollectionMinOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    name?: SortOrder
    source?: SortOrder
    rulesJson?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CollectionRelationFilter = {
    is?: CollectionWhereInput
    isNot?: CollectionWhereInput
  }

  export type CollectionItemCollectionIdEntityIdCompoundUniqueInput = {
    collectionId: string
    entityId: string
  }

  export type CollectionItemCountOrderByAggregateInput = {
    collectionId?: SortOrder
    entityId?: SortOrder
    sortOrder?: SortOrder
  }

  export type CollectionItemAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type CollectionItemMaxOrderByAggregateInput = {
    collectionId?: SortOrder
    entityId?: SortOrder
    sortOrder?: SortOrder
  }

  export type CollectionItemMinOrderByAggregateInput = {
    collectionId?: SortOrder
    entityId?: SortOrder
    sortOrder?: SortOrder
  }

  export type CollectionItemSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type DataBindingCountOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    componentPath?: SortOrder
    bindingKey?: SortOrder
    sourceType?: SortOrder
    sourceRef?: SortOrder
    bindingJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type DataBindingMaxOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    componentPath?: SortOrder
    bindingKey?: SortOrder
    sourceType?: SortOrder
    sourceRef?: SortOrder
    bindingJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type DataBindingMinOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    componentPath?: SortOrder
    bindingKey?: SortOrder
    sourceType?: SortOrder
    sourceRef?: SortOrder
    bindingJson?: SortOrder
    updatedAt?: SortOrder
  }

  export type SnapshotCountOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    label?: SortOrder
    snapshotJson?: SortOrder
    createdAt?: SortOrder
  }

  export type SnapshotMaxOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    label?: SortOrder
    snapshotJson?: SortOrder
    createdAt?: SortOrder
  }

  export type SnapshotMinOrderByAggregateInput = {
    id?: SortOrder
    storeId?: SortOrder
    label?: SortOrder
    snapshotJson?: SortOrder
    createdAt?: SortOrder
  }

  export type StoreStateCreateNestedManyWithoutThemeInput = {
    create?: XOR<StoreStateCreateWithoutThemeInput, StoreStateUncheckedCreateWithoutThemeInput> | StoreStateCreateWithoutThemeInput[] | StoreStateUncheckedCreateWithoutThemeInput[]
    connectOrCreate?: StoreStateCreateOrConnectWithoutThemeInput | StoreStateCreateOrConnectWithoutThemeInput[]
    createMany?: StoreStateCreateManyThemeInputEnvelope
    connect?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
  }

  export type ThemeVersionCreateNestedManyWithoutThemeInput = {
    create?: XOR<ThemeVersionCreateWithoutThemeInput, ThemeVersionUncheckedCreateWithoutThemeInput> | ThemeVersionCreateWithoutThemeInput[] | ThemeVersionUncheckedCreateWithoutThemeInput[]
    connectOrCreate?: ThemeVersionCreateOrConnectWithoutThemeInput | ThemeVersionCreateOrConnectWithoutThemeInput[]
    createMany?: ThemeVersionCreateManyThemeInputEnvelope
    connect?: ThemeVersionWhereUniqueInput | ThemeVersionWhereUniqueInput[]
  }

  export type StoreCreateNestedManyWithoutThemeInput = {
    create?: XOR<StoreCreateWithoutThemeInput, StoreUncheckedCreateWithoutThemeInput> | StoreCreateWithoutThemeInput[] | StoreUncheckedCreateWithoutThemeInput[]
    connectOrCreate?: StoreCreateOrConnectWithoutThemeInput | StoreCreateOrConnectWithoutThemeInput[]
    createMany?: StoreCreateManyThemeInputEnvelope
    connect?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
  }

  export type StoreStateUncheckedCreateNestedManyWithoutThemeInput = {
    create?: XOR<StoreStateCreateWithoutThemeInput, StoreStateUncheckedCreateWithoutThemeInput> | StoreStateCreateWithoutThemeInput[] | StoreStateUncheckedCreateWithoutThemeInput[]
    connectOrCreate?: StoreStateCreateOrConnectWithoutThemeInput | StoreStateCreateOrConnectWithoutThemeInput[]
    createMany?: StoreStateCreateManyThemeInputEnvelope
    connect?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
  }

  export type ThemeVersionUncheckedCreateNestedManyWithoutThemeInput = {
    create?: XOR<ThemeVersionCreateWithoutThemeInput, ThemeVersionUncheckedCreateWithoutThemeInput> | ThemeVersionCreateWithoutThemeInput[] | ThemeVersionUncheckedCreateWithoutThemeInput[]
    connectOrCreate?: ThemeVersionCreateOrConnectWithoutThemeInput | ThemeVersionCreateOrConnectWithoutThemeInput[]
    createMany?: ThemeVersionCreateManyThemeInputEnvelope
    connect?: ThemeVersionWhereUniqueInput | ThemeVersionWhereUniqueInput[]
  }

  export type StoreUncheckedCreateNestedManyWithoutThemeInput = {
    create?: XOR<StoreCreateWithoutThemeInput, StoreUncheckedCreateWithoutThemeInput> | StoreCreateWithoutThemeInput[] | StoreUncheckedCreateWithoutThemeInput[]
    connectOrCreate?: StoreCreateOrConnectWithoutThemeInput | StoreCreateOrConnectWithoutThemeInput[]
    createMany?: StoreCreateManyThemeInputEnvelope
    connect?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type StoreStateUpdateManyWithoutThemeNestedInput = {
    create?: XOR<StoreStateCreateWithoutThemeInput, StoreStateUncheckedCreateWithoutThemeInput> | StoreStateCreateWithoutThemeInput[] | StoreStateUncheckedCreateWithoutThemeInput[]
    connectOrCreate?: StoreStateCreateOrConnectWithoutThemeInput | StoreStateCreateOrConnectWithoutThemeInput[]
    upsert?: StoreStateUpsertWithWhereUniqueWithoutThemeInput | StoreStateUpsertWithWhereUniqueWithoutThemeInput[]
    createMany?: StoreStateCreateManyThemeInputEnvelope
    set?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    disconnect?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    delete?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    connect?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    update?: StoreStateUpdateWithWhereUniqueWithoutThemeInput | StoreStateUpdateWithWhereUniqueWithoutThemeInput[]
    updateMany?: StoreStateUpdateManyWithWhereWithoutThemeInput | StoreStateUpdateManyWithWhereWithoutThemeInput[]
    deleteMany?: StoreStateScalarWhereInput | StoreStateScalarWhereInput[]
  }

  export type ThemeVersionUpdateManyWithoutThemeNestedInput = {
    create?: XOR<ThemeVersionCreateWithoutThemeInput, ThemeVersionUncheckedCreateWithoutThemeInput> | ThemeVersionCreateWithoutThemeInput[] | ThemeVersionUncheckedCreateWithoutThemeInput[]
    connectOrCreate?: ThemeVersionCreateOrConnectWithoutThemeInput | ThemeVersionCreateOrConnectWithoutThemeInput[]
    upsert?: ThemeVersionUpsertWithWhereUniqueWithoutThemeInput | ThemeVersionUpsertWithWhereUniqueWithoutThemeInput[]
    createMany?: ThemeVersionCreateManyThemeInputEnvelope
    set?: ThemeVersionWhereUniqueInput | ThemeVersionWhereUniqueInput[]
    disconnect?: ThemeVersionWhereUniqueInput | ThemeVersionWhereUniqueInput[]
    delete?: ThemeVersionWhereUniqueInput | ThemeVersionWhereUniqueInput[]
    connect?: ThemeVersionWhereUniqueInput | ThemeVersionWhereUniqueInput[]
    update?: ThemeVersionUpdateWithWhereUniqueWithoutThemeInput | ThemeVersionUpdateWithWhereUniqueWithoutThemeInput[]
    updateMany?: ThemeVersionUpdateManyWithWhereWithoutThemeInput | ThemeVersionUpdateManyWithWhereWithoutThemeInput[]
    deleteMany?: ThemeVersionScalarWhereInput | ThemeVersionScalarWhereInput[]
  }

  export type StoreUpdateManyWithoutThemeNestedInput = {
    create?: XOR<StoreCreateWithoutThemeInput, StoreUncheckedCreateWithoutThemeInput> | StoreCreateWithoutThemeInput[] | StoreUncheckedCreateWithoutThemeInput[]
    connectOrCreate?: StoreCreateOrConnectWithoutThemeInput | StoreCreateOrConnectWithoutThemeInput[]
    upsert?: StoreUpsertWithWhereUniqueWithoutThemeInput | StoreUpsertWithWhereUniqueWithoutThemeInput[]
    createMany?: StoreCreateManyThemeInputEnvelope
    set?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    disconnect?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    delete?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    connect?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    update?: StoreUpdateWithWhereUniqueWithoutThemeInput | StoreUpdateWithWhereUniqueWithoutThemeInput[]
    updateMany?: StoreUpdateManyWithWhereWithoutThemeInput | StoreUpdateManyWithWhereWithoutThemeInput[]
    deleteMany?: StoreScalarWhereInput | StoreScalarWhereInput[]
  }

  export type StoreStateUncheckedUpdateManyWithoutThemeNestedInput = {
    create?: XOR<StoreStateCreateWithoutThemeInput, StoreStateUncheckedCreateWithoutThemeInput> | StoreStateCreateWithoutThemeInput[] | StoreStateUncheckedCreateWithoutThemeInput[]
    connectOrCreate?: StoreStateCreateOrConnectWithoutThemeInput | StoreStateCreateOrConnectWithoutThemeInput[]
    upsert?: StoreStateUpsertWithWhereUniqueWithoutThemeInput | StoreStateUpsertWithWhereUniqueWithoutThemeInput[]
    createMany?: StoreStateCreateManyThemeInputEnvelope
    set?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    disconnect?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    delete?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    connect?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    update?: StoreStateUpdateWithWhereUniqueWithoutThemeInput | StoreStateUpdateWithWhereUniqueWithoutThemeInput[]
    updateMany?: StoreStateUpdateManyWithWhereWithoutThemeInput | StoreStateUpdateManyWithWhereWithoutThemeInput[]
    deleteMany?: StoreStateScalarWhereInput | StoreStateScalarWhereInput[]
  }

  export type ThemeVersionUncheckedUpdateManyWithoutThemeNestedInput = {
    create?: XOR<ThemeVersionCreateWithoutThemeInput, ThemeVersionUncheckedCreateWithoutThemeInput> | ThemeVersionCreateWithoutThemeInput[] | ThemeVersionUncheckedCreateWithoutThemeInput[]
    connectOrCreate?: ThemeVersionCreateOrConnectWithoutThemeInput | ThemeVersionCreateOrConnectWithoutThemeInput[]
    upsert?: ThemeVersionUpsertWithWhereUniqueWithoutThemeInput | ThemeVersionUpsertWithWhereUniqueWithoutThemeInput[]
    createMany?: ThemeVersionCreateManyThemeInputEnvelope
    set?: ThemeVersionWhereUniqueInput | ThemeVersionWhereUniqueInput[]
    disconnect?: ThemeVersionWhereUniqueInput | ThemeVersionWhereUniqueInput[]
    delete?: ThemeVersionWhereUniqueInput | ThemeVersionWhereUniqueInput[]
    connect?: ThemeVersionWhereUniqueInput | ThemeVersionWhereUniqueInput[]
    update?: ThemeVersionUpdateWithWhereUniqueWithoutThemeInput | ThemeVersionUpdateWithWhereUniqueWithoutThemeInput[]
    updateMany?: ThemeVersionUpdateManyWithWhereWithoutThemeInput | ThemeVersionUpdateManyWithWhereWithoutThemeInput[]
    deleteMany?: ThemeVersionScalarWhereInput | ThemeVersionScalarWhereInput[]
  }

  export type StoreUncheckedUpdateManyWithoutThemeNestedInput = {
    create?: XOR<StoreCreateWithoutThemeInput, StoreUncheckedCreateWithoutThemeInput> | StoreCreateWithoutThemeInput[] | StoreUncheckedCreateWithoutThemeInput[]
    connectOrCreate?: StoreCreateOrConnectWithoutThemeInput | StoreCreateOrConnectWithoutThemeInput[]
    upsert?: StoreUpsertWithWhereUniqueWithoutThemeInput | StoreUpsertWithWhereUniqueWithoutThemeInput[]
    createMany?: StoreCreateManyThemeInputEnvelope
    set?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    disconnect?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    delete?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    connect?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    update?: StoreUpdateWithWhereUniqueWithoutThemeInput | StoreUpdateWithWhereUniqueWithoutThemeInput[]
    updateMany?: StoreUpdateManyWithWhereWithoutThemeInput | StoreUpdateManyWithWhereWithoutThemeInput[]
    deleteMany?: StoreScalarWhereInput | StoreScalarWhereInput[]
  }

  export type StoreStateCreateNestedManyWithoutThemeVersionInput = {
    create?: XOR<StoreStateCreateWithoutThemeVersionInput, StoreStateUncheckedCreateWithoutThemeVersionInput> | StoreStateCreateWithoutThemeVersionInput[] | StoreStateUncheckedCreateWithoutThemeVersionInput[]
    connectOrCreate?: StoreStateCreateOrConnectWithoutThemeVersionInput | StoreStateCreateOrConnectWithoutThemeVersionInput[]
    createMany?: StoreStateCreateManyThemeVersionInputEnvelope
    connect?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
  }

  export type ThemeCreateNestedOneWithoutVersionsInput = {
    create?: XOR<ThemeCreateWithoutVersionsInput, ThemeUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: ThemeCreateOrConnectWithoutVersionsInput
    connect?: ThemeWhereUniqueInput
  }

  export type StoreCreateNestedManyWithoutThemeVersionInput = {
    create?: XOR<StoreCreateWithoutThemeVersionInput, StoreUncheckedCreateWithoutThemeVersionInput> | StoreCreateWithoutThemeVersionInput[] | StoreUncheckedCreateWithoutThemeVersionInput[]
    connectOrCreate?: StoreCreateOrConnectWithoutThemeVersionInput | StoreCreateOrConnectWithoutThemeVersionInput[]
    createMany?: StoreCreateManyThemeVersionInputEnvelope
    connect?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
  }

  export type StoreStateUncheckedCreateNestedManyWithoutThemeVersionInput = {
    create?: XOR<StoreStateCreateWithoutThemeVersionInput, StoreStateUncheckedCreateWithoutThemeVersionInput> | StoreStateCreateWithoutThemeVersionInput[] | StoreStateUncheckedCreateWithoutThemeVersionInput[]
    connectOrCreate?: StoreStateCreateOrConnectWithoutThemeVersionInput | StoreStateCreateOrConnectWithoutThemeVersionInput[]
    createMany?: StoreStateCreateManyThemeVersionInputEnvelope
    connect?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
  }

  export type StoreUncheckedCreateNestedManyWithoutThemeVersionInput = {
    create?: XOR<StoreCreateWithoutThemeVersionInput, StoreUncheckedCreateWithoutThemeVersionInput> | StoreCreateWithoutThemeVersionInput[] | StoreUncheckedCreateWithoutThemeVersionInput[]
    connectOrCreate?: StoreCreateOrConnectWithoutThemeVersionInput | StoreCreateOrConnectWithoutThemeVersionInput[]
    createMany?: StoreCreateManyThemeVersionInputEnvelope
    connect?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
  }

  export type StoreStateUpdateManyWithoutThemeVersionNestedInput = {
    create?: XOR<StoreStateCreateWithoutThemeVersionInput, StoreStateUncheckedCreateWithoutThemeVersionInput> | StoreStateCreateWithoutThemeVersionInput[] | StoreStateUncheckedCreateWithoutThemeVersionInput[]
    connectOrCreate?: StoreStateCreateOrConnectWithoutThemeVersionInput | StoreStateCreateOrConnectWithoutThemeVersionInput[]
    upsert?: StoreStateUpsertWithWhereUniqueWithoutThemeVersionInput | StoreStateUpsertWithWhereUniqueWithoutThemeVersionInput[]
    createMany?: StoreStateCreateManyThemeVersionInputEnvelope
    set?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    disconnect?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    delete?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    connect?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    update?: StoreStateUpdateWithWhereUniqueWithoutThemeVersionInput | StoreStateUpdateWithWhereUniqueWithoutThemeVersionInput[]
    updateMany?: StoreStateUpdateManyWithWhereWithoutThemeVersionInput | StoreStateUpdateManyWithWhereWithoutThemeVersionInput[]
    deleteMany?: StoreStateScalarWhereInput | StoreStateScalarWhereInput[]
  }

  export type ThemeUpdateOneRequiredWithoutVersionsNestedInput = {
    create?: XOR<ThemeCreateWithoutVersionsInput, ThemeUncheckedCreateWithoutVersionsInput>
    connectOrCreate?: ThemeCreateOrConnectWithoutVersionsInput
    upsert?: ThemeUpsertWithoutVersionsInput
    connect?: ThemeWhereUniqueInput
    update?: XOR<XOR<ThemeUpdateToOneWithWhereWithoutVersionsInput, ThemeUpdateWithoutVersionsInput>, ThemeUncheckedUpdateWithoutVersionsInput>
  }

  export type StoreUpdateManyWithoutThemeVersionNestedInput = {
    create?: XOR<StoreCreateWithoutThemeVersionInput, StoreUncheckedCreateWithoutThemeVersionInput> | StoreCreateWithoutThemeVersionInput[] | StoreUncheckedCreateWithoutThemeVersionInput[]
    connectOrCreate?: StoreCreateOrConnectWithoutThemeVersionInput | StoreCreateOrConnectWithoutThemeVersionInput[]
    upsert?: StoreUpsertWithWhereUniqueWithoutThemeVersionInput | StoreUpsertWithWhereUniqueWithoutThemeVersionInput[]
    createMany?: StoreCreateManyThemeVersionInputEnvelope
    set?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    disconnect?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    delete?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    connect?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    update?: StoreUpdateWithWhereUniqueWithoutThemeVersionInput | StoreUpdateWithWhereUniqueWithoutThemeVersionInput[]
    updateMany?: StoreUpdateManyWithWhereWithoutThemeVersionInput | StoreUpdateManyWithWhereWithoutThemeVersionInput[]
    deleteMany?: StoreScalarWhereInput | StoreScalarWhereInput[]
  }

  export type StoreStateUncheckedUpdateManyWithoutThemeVersionNestedInput = {
    create?: XOR<StoreStateCreateWithoutThemeVersionInput, StoreStateUncheckedCreateWithoutThemeVersionInput> | StoreStateCreateWithoutThemeVersionInput[] | StoreStateUncheckedCreateWithoutThemeVersionInput[]
    connectOrCreate?: StoreStateCreateOrConnectWithoutThemeVersionInput | StoreStateCreateOrConnectWithoutThemeVersionInput[]
    upsert?: StoreStateUpsertWithWhereUniqueWithoutThemeVersionInput | StoreStateUpsertWithWhereUniqueWithoutThemeVersionInput[]
    createMany?: StoreStateCreateManyThemeVersionInputEnvelope
    set?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    disconnect?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    delete?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    connect?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    update?: StoreStateUpdateWithWhereUniqueWithoutThemeVersionInput | StoreStateUpdateWithWhereUniqueWithoutThemeVersionInput[]
    updateMany?: StoreStateUpdateManyWithWhereWithoutThemeVersionInput | StoreStateUpdateManyWithWhereWithoutThemeVersionInput[]
    deleteMany?: StoreStateScalarWhereInput | StoreStateScalarWhereInput[]
  }

  export type StoreUncheckedUpdateManyWithoutThemeVersionNestedInput = {
    create?: XOR<StoreCreateWithoutThemeVersionInput, StoreUncheckedCreateWithoutThemeVersionInput> | StoreCreateWithoutThemeVersionInput[] | StoreUncheckedCreateWithoutThemeVersionInput[]
    connectOrCreate?: StoreCreateOrConnectWithoutThemeVersionInput | StoreCreateOrConnectWithoutThemeVersionInput[]
    upsert?: StoreUpsertWithWhereUniqueWithoutThemeVersionInput | StoreUpsertWithWhereUniqueWithoutThemeVersionInput[]
    createMany?: StoreCreateManyThemeVersionInputEnvelope
    set?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    disconnect?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    delete?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    connect?: StoreWhereUniqueInput | StoreWhereUniqueInput[]
    update?: StoreUpdateWithWhereUniqueWithoutThemeVersionInput | StoreUpdateWithWhereUniqueWithoutThemeVersionInput[]
    updateMany?: StoreUpdateManyWithWhereWithoutThemeVersionInput | StoreUpdateManyWithWhereWithoutThemeVersionInput[]
    deleteMany?: StoreScalarWhereInput | StoreScalarWhereInput[]
  }

  export type ThemeCreateNestedOneWithoutStoresInput = {
    create?: XOR<ThemeCreateWithoutStoresInput, ThemeUncheckedCreateWithoutStoresInput>
    connectOrCreate?: ThemeCreateOrConnectWithoutStoresInput
    connect?: ThemeWhereUniqueInput
  }

  export type ThemeVersionCreateNestedOneWithoutStoresInput = {
    create?: XOR<ThemeVersionCreateWithoutStoresInput, ThemeVersionUncheckedCreateWithoutStoresInput>
    connectOrCreate?: ThemeVersionCreateOrConnectWithoutStoresInput
    connect?: ThemeVersionWhereUniqueInput
  }

  export type CollectionCreateNestedManyWithoutStoreInput = {
    create?: XOR<CollectionCreateWithoutStoreInput, CollectionUncheckedCreateWithoutStoreInput> | CollectionCreateWithoutStoreInput[] | CollectionUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: CollectionCreateOrConnectWithoutStoreInput | CollectionCreateOrConnectWithoutStoreInput[]
    createMany?: CollectionCreateManyStoreInputEnvelope
    connect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
  }

  export type ComponentStateCreateNestedManyWithoutStoreInput = {
    create?: XOR<ComponentStateCreateWithoutStoreInput, ComponentStateUncheckedCreateWithoutStoreInput> | ComponentStateCreateWithoutStoreInput[] | ComponentStateUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: ComponentStateCreateOrConnectWithoutStoreInput | ComponentStateCreateOrConnectWithoutStoreInput[]
    createMany?: ComponentStateCreateManyStoreInputEnvelope
    connect?: ComponentStateWhereUniqueInput | ComponentStateWhereUniqueInput[]
  }

  export type DataBindingCreateNestedManyWithoutStoreInput = {
    create?: XOR<DataBindingCreateWithoutStoreInput, DataBindingUncheckedCreateWithoutStoreInput> | DataBindingCreateWithoutStoreInput[] | DataBindingUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: DataBindingCreateOrConnectWithoutStoreInput | DataBindingCreateOrConnectWithoutStoreInput[]
    createMany?: DataBindingCreateManyStoreInputEnvelope
    connect?: DataBindingWhereUniqueInput | DataBindingWhereUniqueInput[]
  }

  export type DataEntityCreateNestedManyWithoutStoreInput = {
    create?: XOR<DataEntityCreateWithoutStoreInput, DataEntityUncheckedCreateWithoutStoreInput> | DataEntityCreateWithoutStoreInput[] | DataEntityUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: DataEntityCreateOrConnectWithoutStoreInput | DataEntityCreateOrConnectWithoutStoreInput[]
    createMany?: DataEntityCreateManyStoreInputEnvelope
    connect?: DataEntityWhereUniqueInput | DataEntityWhereUniqueInput[]
  }

  export type PageCompositionCreateNestedManyWithoutStoreInput = {
    create?: XOR<PageCompositionCreateWithoutStoreInput, PageCompositionUncheckedCreateWithoutStoreInput> | PageCompositionCreateWithoutStoreInput[] | PageCompositionUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: PageCompositionCreateOrConnectWithoutStoreInput | PageCompositionCreateOrConnectWithoutStoreInput[]
    createMany?: PageCompositionCreateManyStoreInputEnvelope
    connect?: PageCompositionWhereUniqueInput | PageCompositionWhereUniqueInput[]
  }

  export type SnapshotCreateNestedManyWithoutStoreInput = {
    create?: XOR<SnapshotCreateWithoutStoreInput, SnapshotUncheckedCreateWithoutStoreInput> | SnapshotCreateWithoutStoreInput[] | SnapshotUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: SnapshotCreateOrConnectWithoutStoreInput | SnapshotCreateOrConnectWithoutStoreInput[]
    createMany?: SnapshotCreateManyStoreInputEnvelope
    connect?: SnapshotWhereUniqueInput | SnapshotWhereUniqueInput[]
  }

  export type StoreStateCreateNestedManyWithoutStoreInput = {
    create?: XOR<StoreStateCreateWithoutStoreInput, StoreStateUncheckedCreateWithoutStoreInput> | StoreStateCreateWithoutStoreInput[] | StoreStateUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: StoreStateCreateOrConnectWithoutStoreInput | StoreStateCreateOrConnectWithoutStoreInput[]
    createMany?: StoreStateCreateManyStoreInputEnvelope
    connect?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
  }

  export type CollectionUncheckedCreateNestedManyWithoutStoreInput = {
    create?: XOR<CollectionCreateWithoutStoreInput, CollectionUncheckedCreateWithoutStoreInput> | CollectionCreateWithoutStoreInput[] | CollectionUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: CollectionCreateOrConnectWithoutStoreInput | CollectionCreateOrConnectWithoutStoreInput[]
    createMany?: CollectionCreateManyStoreInputEnvelope
    connect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
  }

  export type ComponentStateUncheckedCreateNestedManyWithoutStoreInput = {
    create?: XOR<ComponentStateCreateWithoutStoreInput, ComponentStateUncheckedCreateWithoutStoreInput> | ComponentStateCreateWithoutStoreInput[] | ComponentStateUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: ComponentStateCreateOrConnectWithoutStoreInput | ComponentStateCreateOrConnectWithoutStoreInput[]
    createMany?: ComponentStateCreateManyStoreInputEnvelope
    connect?: ComponentStateWhereUniqueInput | ComponentStateWhereUniqueInput[]
  }

  export type DataBindingUncheckedCreateNestedManyWithoutStoreInput = {
    create?: XOR<DataBindingCreateWithoutStoreInput, DataBindingUncheckedCreateWithoutStoreInput> | DataBindingCreateWithoutStoreInput[] | DataBindingUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: DataBindingCreateOrConnectWithoutStoreInput | DataBindingCreateOrConnectWithoutStoreInput[]
    createMany?: DataBindingCreateManyStoreInputEnvelope
    connect?: DataBindingWhereUniqueInput | DataBindingWhereUniqueInput[]
  }

  export type DataEntityUncheckedCreateNestedManyWithoutStoreInput = {
    create?: XOR<DataEntityCreateWithoutStoreInput, DataEntityUncheckedCreateWithoutStoreInput> | DataEntityCreateWithoutStoreInput[] | DataEntityUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: DataEntityCreateOrConnectWithoutStoreInput | DataEntityCreateOrConnectWithoutStoreInput[]
    createMany?: DataEntityCreateManyStoreInputEnvelope
    connect?: DataEntityWhereUniqueInput | DataEntityWhereUniqueInput[]
  }

  export type PageCompositionUncheckedCreateNestedManyWithoutStoreInput = {
    create?: XOR<PageCompositionCreateWithoutStoreInput, PageCompositionUncheckedCreateWithoutStoreInput> | PageCompositionCreateWithoutStoreInput[] | PageCompositionUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: PageCompositionCreateOrConnectWithoutStoreInput | PageCompositionCreateOrConnectWithoutStoreInput[]
    createMany?: PageCompositionCreateManyStoreInputEnvelope
    connect?: PageCompositionWhereUniqueInput | PageCompositionWhereUniqueInput[]
  }

  export type SnapshotUncheckedCreateNestedManyWithoutStoreInput = {
    create?: XOR<SnapshotCreateWithoutStoreInput, SnapshotUncheckedCreateWithoutStoreInput> | SnapshotCreateWithoutStoreInput[] | SnapshotUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: SnapshotCreateOrConnectWithoutStoreInput | SnapshotCreateOrConnectWithoutStoreInput[]
    createMany?: SnapshotCreateManyStoreInputEnvelope
    connect?: SnapshotWhereUniqueInput | SnapshotWhereUniqueInput[]
  }

  export type StoreStateUncheckedCreateNestedManyWithoutStoreInput = {
    create?: XOR<StoreStateCreateWithoutStoreInput, StoreStateUncheckedCreateWithoutStoreInput> | StoreStateCreateWithoutStoreInput[] | StoreStateUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: StoreStateCreateOrConnectWithoutStoreInput | StoreStateCreateOrConnectWithoutStoreInput[]
    createMany?: StoreStateCreateManyStoreInputEnvelope
    connect?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ThemeUpdateOneRequiredWithoutStoresNestedInput = {
    create?: XOR<ThemeCreateWithoutStoresInput, ThemeUncheckedCreateWithoutStoresInput>
    connectOrCreate?: ThemeCreateOrConnectWithoutStoresInput
    upsert?: ThemeUpsertWithoutStoresInput
    connect?: ThemeWhereUniqueInput
    update?: XOR<XOR<ThemeUpdateToOneWithWhereWithoutStoresInput, ThemeUpdateWithoutStoresInput>, ThemeUncheckedUpdateWithoutStoresInput>
  }

  export type ThemeVersionUpdateOneRequiredWithoutStoresNestedInput = {
    create?: XOR<ThemeVersionCreateWithoutStoresInput, ThemeVersionUncheckedCreateWithoutStoresInput>
    connectOrCreate?: ThemeVersionCreateOrConnectWithoutStoresInput
    upsert?: ThemeVersionUpsertWithoutStoresInput
    connect?: ThemeVersionWhereUniqueInput
    update?: XOR<XOR<ThemeVersionUpdateToOneWithWhereWithoutStoresInput, ThemeVersionUpdateWithoutStoresInput>, ThemeVersionUncheckedUpdateWithoutStoresInput>
  }

  export type CollectionUpdateManyWithoutStoreNestedInput = {
    create?: XOR<CollectionCreateWithoutStoreInput, CollectionUncheckedCreateWithoutStoreInput> | CollectionCreateWithoutStoreInput[] | CollectionUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: CollectionCreateOrConnectWithoutStoreInput | CollectionCreateOrConnectWithoutStoreInput[]
    upsert?: CollectionUpsertWithWhereUniqueWithoutStoreInput | CollectionUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: CollectionCreateManyStoreInputEnvelope
    set?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    disconnect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    delete?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    connect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    update?: CollectionUpdateWithWhereUniqueWithoutStoreInput | CollectionUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: CollectionUpdateManyWithWhereWithoutStoreInput | CollectionUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: CollectionScalarWhereInput | CollectionScalarWhereInput[]
  }

  export type ComponentStateUpdateManyWithoutStoreNestedInput = {
    create?: XOR<ComponentStateCreateWithoutStoreInput, ComponentStateUncheckedCreateWithoutStoreInput> | ComponentStateCreateWithoutStoreInput[] | ComponentStateUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: ComponentStateCreateOrConnectWithoutStoreInput | ComponentStateCreateOrConnectWithoutStoreInput[]
    upsert?: ComponentStateUpsertWithWhereUniqueWithoutStoreInput | ComponentStateUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: ComponentStateCreateManyStoreInputEnvelope
    set?: ComponentStateWhereUniqueInput | ComponentStateWhereUniqueInput[]
    disconnect?: ComponentStateWhereUniqueInput | ComponentStateWhereUniqueInput[]
    delete?: ComponentStateWhereUniqueInput | ComponentStateWhereUniqueInput[]
    connect?: ComponentStateWhereUniqueInput | ComponentStateWhereUniqueInput[]
    update?: ComponentStateUpdateWithWhereUniqueWithoutStoreInput | ComponentStateUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: ComponentStateUpdateManyWithWhereWithoutStoreInput | ComponentStateUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: ComponentStateScalarWhereInput | ComponentStateScalarWhereInput[]
  }

  export type DataBindingUpdateManyWithoutStoreNestedInput = {
    create?: XOR<DataBindingCreateWithoutStoreInput, DataBindingUncheckedCreateWithoutStoreInput> | DataBindingCreateWithoutStoreInput[] | DataBindingUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: DataBindingCreateOrConnectWithoutStoreInput | DataBindingCreateOrConnectWithoutStoreInput[]
    upsert?: DataBindingUpsertWithWhereUniqueWithoutStoreInput | DataBindingUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: DataBindingCreateManyStoreInputEnvelope
    set?: DataBindingWhereUniqueInput | DataBindingWhereUniqueInput[]
    disconnect?: DataBindingWhereUniqueInput | DataBindingWhereUniqueInput[]
    delete?: DataBindingWhereUniqueInput | DataBindingWhereUniqueInput[]
    connect?: DataBindingWhereUniqueInput | DataBindingWhereUniqueInput[]
    update?: DataBindingUpdateWithWhereUniqueWithoutStoreInput | DataBindingUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: DataBindingUpdateManyWithWhereWithoutStoreInput | DataBindingUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: DataBindingScalarWhereInput | DataBindingScalarWhereInput[]
  }

  export type DataEntityUpdateManyWithoutStoreNestedInput = {
    create?: XOR<DataEntityCreateWithoutStoreInput, DataEntityUncheckedCreateWithoutStoreInput> | DataEntityCreateWithoutStoreInput[] | DataEntityUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: DataEntityCreateOrConnectWithoutStoreInput | DataEntityCreateOrConnectWithoutStoreInput[]
    upsert?: DataEntityUpsertWithWhereUniqueWithoutStoreInput | DataEntityUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: DataEntityCreateManyStoreInputEnvelope
    set?: DataEntityWhereUniqueInput | DataEntityWhereUniqueInput[]
    disconnect?: DataEntityWhereUniqueInput | DataEntityWhereUniqueInput[]
    delete?: DataEntityWhereUniqueInput | DataEntityWhereUniqueInput[]
    connect?: DataEntityWhereUniqueInput | DataEntityWhereUniqueInput[]
    update?: DataEntityUpdateWithWhereUniqueWithoutStoreInput | DataEntityUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: DataEntityUpdateManyWithWhereWithoutStoreInput | DataEntityUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: DataEntityScalarWhereInput | DataEntityScalarWhereInput[]
  }

  export type PageCompositionUpdateManyWithoutStoreNestedInput = {
    create?: XOR<PageCompositionCreateWithoutStoreInput, PageCompositionUncheckedCreateWithoutStoreInput> | PageCompositionCreateWithoutStoreInput[] | PageCompositionUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: PageCompositionCreateOrConnectWithoutStoreInput | PageCompositionCreateOrConnectWithoutStoreInput[]
    upsert?: PageCompositionUpsertWithWhereUniqueWithoutStoreInput | PageCompositionUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: PageCompositionCreateManyStoreInputEnvelope
    set?: PageCompositionWhereUniqueInput | PageCompositionWhereUniqueInput[]
    disconnect?: PageCompositionWhereUniqueInput | PageCompositionWhereUniqueInput[]
    delete?: PageCompositionWhereUniqueInput | PageCompositionWhereUniqueInput[]
    connect?: PageCompositionWhereUniqueInput | PageCompositionWhereUniqueInput[]
    update?: PageCompositionUpdateWithWhereUniqueWithoutStoreInput | PageCompositionUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: PageCompositionUpdateManyWithWhereWithoutStoreInput | PageCompositionUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: PageCompositionScalarWhereInput | PageCompositionScalarWhereInput[]
  }

  export type SnapshotUpdateManyWithoutStoreNestedInput = {
    create?: XOR<SnapshotCreateWithoutStoreInput, SnapshotUncheckedCreateWithoutStoreInput> | SnapshotCreateWithoutStoreInput[] | SnapshotUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: SnapshotCreateOrConnectWithoutStoreInput | SnapshotCreateOrConnectWithoutStoreInput[]
    upsert?: SnapshotUpsertWithWhereUniqueWithoutStoreInput | SnapshotUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: SnapshotCreateManyStoreInputEnvelope
    set?: SnapshotWhereUniqueInput | SnapshotWhereUniqueInput[]
    disconnect?: SnapshotWhereUniqueInput | SnapshotWhereUniqueInput[]
    delete?: SnapshotWhereUniqueInput | SnapshotWhereUniqueInput[]
    connect?: SnapshotWhereUniqueInput | SnapshotWhereUniqueInput[]
    update?: SnapshotUpdateWithWhereUniqueWithoutStoreInput | SnapshotUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: SnapshotUpdateManyWithWhereWithoutStoreInput | SnapshotUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: SnapshotScalarWhereInput | SnapshotScalarWhereInput[]
  }

  export type StoreStateUpdateManyWithoutStoreNestedInput = {
    create?: XOR<StoreStateCreateWithoutStoreInput, StoreStateUncheckedCreateWithoutStoreInput> | StoreStateCreateWithoutStoreInput[] | StoreStateUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: StoreStateCreateOrConnectWithoutStoreInput | StoreStateCreateOrConnectWithoutStoreInput[]
    upsert?: StoreStateUpsertWithWhereUniqueWithoutStoreInput | StoreStateUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: StoreStateCreateManyStoreInputEnvelope
    set?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    disconnect?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    delete?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    connect?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    update?: StoreStateUpdateWithWhereUniqueWithoutStoreInput | StoreStateUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: StoreStateUpdateManyWithWhereWithoutStoreInput | StoreStateUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: StoreStateScalarWhereInput | StoreStateScalarWhereInput[]
  }

  export type CollectionUncheckedUpdateManyWithoutStoreNestedInput = {
    create?: XOR<CollectionCreateWithoutStoreInput, CollectionUncheckedCreateWithoutStoreInput> | CollectionCreateWithoutStoreInput[] | CollectionUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: CollectionCreateOrConnectWithoutStoreInput | CollectionCreateOrConnectWithoutStoreInput[]
    upsert?: CollectionUpsertWithWhereUniqueWithoutStoreInput | CollectionUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: CollectionCreateManyStoreInputEnvelope
    set?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    disconnect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    delete?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    connect?: CollectionWhereUniqueInput | CollectionWhereUniqueInput[]
    update?: CollectionUpdateWithWhereUniqueWithoutStoreInput | CollectionUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: CollectionUpdateManyWithWhereWithoutStoreInput | CollectionUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: CollectionScalarWhereInput | CollectionScalarWhereInput[]
  }

  export type ComponentStateUncheckedUpdateManyWithoutStoreNestedInput = {
    create?: XOR<ComponentStateCreateWithoutStoreInput, ComponentStateUncheckedCreateWithoutStoreInput> | ComponentStateCreateWithoutStoreInput[] | ComponentStateUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: ComponentStateCreateOrConnectWithoutStoreInput | ComponentStateCreateOrConnectWithoutStoreInput[]
    upsert?: ComponentStateUpsertWithWhereUniqueWithoutStoreInput | ComponentStateUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: ComponentStateCreateManyStoreInputEnvelope
    set?: ComponentStateWhereUniqueInput | ComponentStateWhereUniqueInput[]
    disconnect?: ComponentStateWhereUniqueInput | ComponentStateWhereUniqueInput[]
    delete?: ComponentStateWhereUniqueInput | ComponentStateWhereUniqueInput[]
    connect?: ComponentStateWhereUniqueInput | ComponentStateWhereUniqueInput[]
    update?: ComponentStateUpdateWithWhereUniqueWithoutStoreInput | ComponentStateUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: ComponentStateUpdateManyWithWhereWithoutStoreInput | ComponentStateUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: ComponentStateScalarWhereInput | ComponentStateScalarWhereInput[]
  }

  export type DataBindingUncheckedUpdateManyWithoutStoreNestedInput = {
    create?: XOR<DataBindingCreateWithoutStoreInput, DataBindingUncheckedCreateWithoutStoreInput> | DataBindingCreateWithoutStoreInput[] | DataBindingUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: DataBindingCreateOrConnectWithoutStoreInput | DataBindingCreateOrConnectWithoutStoreInput[]
    upsert?: DataBindingUpsertWithWhereUniqueWithoutStoreInput | DataBindingUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: DataBindingCreateManyStoreInputEnvelope
    set?: DataBindingWhereUniqueInput | DataBindingWhereUniqueInput[]
    disconnect?: DataBindingWhereUniqueInput | DataBindingWhereUniqueInput[]
    delete?: DataBindingWhereUniqueInput | DataBindingWhereUniqueInput[]
    connect?: DataBindingWhereUniqueInput | DataBindingWhereUniqueInput[]
    update?: DataBindingUpdateWithWhereUniqueWithoutStoreInput | DataBindingUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: DataBindingUpdateManyWithWhereWithoutStoreInput | DataBindingUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: DataBindingScalarWhereInput | DataBindingScalarWhereInput[]
  }

  export type DataEntityUncheckedUpdateManyWithoutStoreNestedInput = {
    create?: XOR<DataEntityCreateWithoutStoreInput, DataEntityUncheckedCreateWithoutStoreInput> | DataEntityCreateWithoutStoreInput[] | DataEntityUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: DataEntityCreateOrConnectWithoutStoreInput | DataEntityCreateOrConnectWithoutStoreInput[]
    upsert?: DataEntityUpsertWithWhereUniqueWithoutStoreInput | DataEntityUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: DataEntityCreateManyStoreInputEnvelope
    set?: DataEntityWhereUniqueInput | DataEntityWhereUniqueInput[]
    disconnect?: DataEntityWhereUniqueInput | DataEntityWhereUniqueInput[]
    delete?: DataEntityWhereUniqueInput | DataEntityWhereUniqueInput[]
    connect?: DataEntityWhereUniqueInput | DataEntityWhereUniqueInput[]
    update?: DataEntityUpdateWithWhereUniqueWithoutStoreInput | DataEntityUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: DataEntityUpdateManyWithWhereWithoutStoreInput | DataEntityUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: DataEntityScalarWhereInput | DataEntityScalarWhereInput[]
  }

  export type PageCompositionUncheckedUpdateManyWithoutStoreNestedInput = {
    create?: XOR<PageCompositionCreateWithoutStoreInput, PageCompositionUncheckedCreateWithoutStoreInput> | PageCompositionCreateWithoutStoreInput[] | PageCompositionUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: PageCompositionCreateOrConnectWithoutStoreInput | PageCompositionCreateOrConnectWithoutStoreInput[]
    upsert?: PageCompositionUpsertWithWhereUniqueWithoutStoreInput | PageCompositionUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: PageCompositionCreateManyStoreInputEnvelope
    set?: PageCompositionWhereUniqueInput | PageCompositionWhereUniqueInput[]
    disconnect?: PageCompositionWhereUniqueInput | PageCompositionWhereUniqueInput[]
    delete?: PageCompositionWhereUniqueInput | PageCompositionWhereUniqueInput[]
    connect?: PageCompositionWhereUniqueInput | PageCompositionWhereUniqueInput[]
    update?: PageCompositionUpdateWithWhereUniqueWithoutStoreInput | PageCompositionUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: PageCompositionUpdateManyWithWhereWithoutStoreInput | PageCompositionUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: PageCompositionScalarWhereInput | PageCompositionScalarWhereInput[]
  }

  export type SnapshotUncheckedUpdateManyWithoutStoreNestedInput = {
    create?: XOR<SnapshotCreateWithoutStoreInput, SnapshotUncheckedCreateWithoutStoreInput> | SnapshotCreateWithoutStoreInput[] | SnapshotUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: SnapshotCreateOrConnectWithoutStoreInput | SnapshotCreateOrConnectWithoutStoreInput[]
    upsert?: SnapshotUpsertWithWhereUniqueWithoutStoreInput | SnapshotUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: SnapshotCreateManyStoreInputEnvelope
    set?: SnapshotWhereUniqueInput | SnapshotWhereUniqueInput[]
    disconnect?: SnapshotWhereUniqueInput | SnapshotWhereUniqueInput[]
    delete?: SnapshotWhereUniqueInput | SnapshotWhereUniqueInput[]
    connect?: SnapshotWhereUniqueInput | SnapshotWhereUniqueInput[]
    update?: SnapshotUpdateWithWhereUniqueWithoutStoreInput | SnapshotUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: SnapshotUpdateManyWithWhereWithoutStoreInput | SnapshotUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: SnapshotScalarWhereInput | SnapshotScalarWhereInput[]
  }

  export type StoreStateUncheckedUpdateManyWithoutStoreNestedInput = {
    create?: XOR<StoreStateCreateWithoutStoreInput, StoreStateUncheckedCreateWithoutStoreInput> | StoreStateCreateWithoutStoreInput[] | StoreStateUncheckedCreateWithoutStoreInput[]
    connectOrCreate?: StoreStateCreateOrConnectWithoutStoreInput | StoreStateCreateOrConnectWithoutStoreInput[]
    upsert?: StoreStateUpsertWithWhereUniqueWithoutStoreInput | StoreStateUpsertWithWhereUniqueWithoutStoreInput[]
    createMany?: StoreStateCreateManyStoreInputEnvelope
    set?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    disconnect?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    delete?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    connect?: StoreStateWhereUniqueInput | StoreStateWhereUniqueInput[]
    update?: StoreStateUpdateWithWhereUniqueWithoutStoreInput | StoreStateUpdateWithWhereUniqueWithoutStoreInput[]
    updateMany?: StoreStateUpdateManyWithWhereWithoutStoreInput | StoreStateUpdateManyWithWhereWithoutStoreInput[]
    deleteMany?: StoreStateScalarWhereInput | StoreStateScalarWhereInput[]
  }

  export type ThemeVersionCreateNestedOneWithoutStoreStatesInput = {
    create?: XOR<ThemeVersionCreateWithoutStoreStatesInput, ThemeVersionUncheckedCreateWithoutStoreStatesInput>
    connectOrCreate?: ThemeVersionCreateOrConnectWithoutStoreStatesInput
    connect?: ThemeVersionWhereUniqueInput
  }

  export type ThemeCreateNestedOneWithoutStoreStatesInput = {
    create?: XOR<ThemeCreateWithoutStoreStatesInput, ThemeUncheckedCreateWithoutStoreStatesInput>
    connectOrCreate?: ThemeCreateOrConnectWithoutStoreStatesInput
    connect?: ThemeWhereUniqueInput
  }

  export type StoreCreateNestedOneWithoutStoreStatesInput = {
    create?: XOR<StoreCreateWithoutStoreStatesInput, StoreUncheckedCreateWithoutStoreStatesInput>
    connectOrCreate?: StoreCreateOrConnectWithoutStoreStatesInput
    connect?: StoreWhereUniqueInput
  }

  export type ThemeVersionUpdateOneRequiredWithoutStoreStatesNestedInput = {
    create?: XOR<ThemeVersionCreateWithoutStoreStatesInput, ThemeVersionUncheckedCreateWithoutStoreStatesInput>
    connectOrCreate?: ThemeVersionCreateOrConnectWithoutStoreStatesInput
    upsert?: ThemeVersionUpsertWithoutStoreStatesInput
    connect?: ThemeVersionWhereUniqueInput
    update?: XOR<XOR<ThemeVersionUpdateToOneWithWhereWithoutStoreStatesInput, ThemeVersionUpdateWithoutStoreStatesInput>, ThemeVersionUncheckedUpdateWithoutStoreStatesInput>
  }

  export type ThemeUpdateOneRequiredWithoutStoreStatesNestedInput = {
    create?: XOR<ThemeCreateWithoutStoreStatesInput, ThemeUncheckedCreateWithoutStoreStatesInput>
    connectOrCreate?: ThemeCreateOrConnectWithoutStoreStatesInput
    upsert?: ThemeUpsertWithoutStoreStatesInput
    connect?: ThemeWhereUniqueInput
    update?: XOR<XOR<ThemeUpdateToOneWithWhereWithoutStoreStatesInput, ThemeUpdateWithoutStoreStatesInput>, ThemeUncheckedUpdateWithoutStoreStatesInput>
  }

  export type StoreUpdateOneRequiredWithoutStoreStatesNestedInput = {
    create?: XOR<StoreCreateWithoutStoreStatesInput, StoreUncheckedCreateWithoutStoreStatesInput>
    connectOrCreate?: StoreCreateOrConnectWithoutStoreStatesInput
    upsert?: StoreUpsertWithoutStoreStatesInput
    connect?: StoreWhereUniqueInput
    update?: XOR<XOR<StoreUpdateToOneWithWhereWithoutStoreStatesInput, StoreUpdateWithoutStoreStatesInput>, StoreUncheckedUpdateWithoutStoreStatesInput>
  }

  export type StoreCreateNestedOneWithoutComponentStatesInput = {
    create?: XOR<StoreCreateWithoutComponentStatesInput, StoreUncheckedCreateWithoutComponentStatesInput>
    connectOrCreate?: StoreCreateOrConnectWithoutComponentStatesInput
    connect?: StoreWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StoreUpdateOneRequiredWithoutComponentStatesNestedInput = {
    create?: XOR<StoreCreateWithoutComponentStatesInput, StoreUncheckedCreateWithoutComponentStatesInput>
    connectOrCreate?: StoreCreateOrConnectWithoutComponentStatesInput
    upsert?: StoreUpsertWithoutComponentStatesInput
    connect?: StoreWhereUniqueInput
    update?: XOR<XOR<StoreUpdateToOneWithWhereWithoutComponentStatesInput, StoreUpdateWithoutComponentStatesInput>, StoreUncheckedUpdateWithoutComponentStatesInput>
  }

  export type StoreCreateNestedOneWithoutPageCompositionsInput = {
    create?: XOR<StoreCreateWithoutPageCompositionsInput, StoreUncheckedCreateWithoutPageCompositionsInput>
    connectOrCreate?: StoreCreateOrConnectWithoutPageCompositionsInput
    connect?: StoreWhereUniqueInput
  }

  export type StoreUpdateOneRequiredWithoutPageCompositionsNestedInput = {
    create?: XOR<StoreCreateWithoutPageCompositionsInput, StoreUncheckedCreateWithoutPageCompositionsInput>
    connectOrCreate?: StoreCreateOrConnectWithoutPageCompositionsInput
    upsert?: StoreUpsertWithoutPageCompositionsInput
    connect?: StoreWhereUniqueInput
    update?: XOR<XOR<StoreUpdateToOneWithWhereWithoutPageCompositionsInput, StoreUpdateWithoutPageCompositionsInput>, StoreUncheckedUpdateWithoutPageCompositionsInput>
  }

  export type StoreCreateNestedOneWithoutDataEntitiesInput = {
    create?: XOR<StoreCreateWithoutDataEntitiesInput, StoreUncheckedCreateWithoutDataEntitiesInput>
    connectOrCreate?: StoreCreateOrConnectWithoutDataEntitiesInput
    connect?: StoreWhereUniqueInput
  }

  export type StoreUpdateOneRequiredWithoutDataEntitiesNestedInput = {
    create?: XOR<StoreCreateWithoutDataEntitiesInput, StoreUncheckedCreateWithoutDataEntitiesInput>
    connectOrCreate?: StoreCreateOrConnectWithoutDataEntitiesInput
    upsert?: StoreUpsertWithoutDataEntitiesInput
    connect?: StoreWhereUniqueInput
    update?: XOR<XOR<StoreUpdateToOneWithWhereWithoutDataEntitiesInput, StoreUpdateWithoutDataEntitiesInput>, StoreUncheckedUpdateWithoutDataEntitiesInput>
  }

  export type StoreCreateNestedOneWithoutCollectionsInput = {
    create?: XOR<StoreCreateWithoutCollectionsInput, StoreUncheckedCreateWithoutCollectionsInput>
    connectOrCreate?: StoreCreateOrConnectWithoutCollectionsInput
    connect?: StoreWhereUniqueInput
  }

  export type CollectionItemCreateNestedManyWithoutCollectionInput = {
    create?: XOR<CollectionItemCreateWithoutCollectionInput, CollectionItemUncheckedCreateWithoutCollectionInput> | CollectionItemCreateWithoutCollectionInput[] | CollectionItemUncheckedCreateWithoutCollectionInput[]
    connectOrCreate?: CollectionItemCreateOrConnectWithoutCollectionInput | CollectionItemCreateOrConnectWithoutCollectionInput[]
    createMany?: CollectionItemCreateManyCollectionInputEnvelope
    connect?: CollectionItemWhereUniqueInput | CollectionItemWhereUniqueInput[]
  }

  export type CollectionItemUncheckedCreateNestedManyWithoutCollectionInput = {
    create?: XOR<CollectionItemCreateWithoutCollectionInput, CollectionItemUncheckedCreateWithoutCollectionInput> | CollectionItemCreateWithoutCollectionInput[] | CollectionItemUncheckedCreateWithoutCollectionInput[]
    connectOrCreate?: CollectionItemCreateOrConnectWithoutCollectionInput | CollectionItemCreateOrConnectWithoutCollectionInput[]
    createMany?: CollectionItemCreateManyCollectionInputEnvelope
    connect?: CollectionItemWhereUniqueInput | CollectionItemWhereUniqueInput[]
  }

  export type StoreUpdateOneRequiredWithoutCollectionsNestedInput = {
    create?: XOR<StoreCreateWithoutCollectionsInput, StoreUncheckedCreateWithoutCollectionsInput>
    connectOrCreate?: StoreCreateOrConnectWithoutCollectionsInput
    upsert?: StoreUpsertWithoutCollectionsInput
    connect?: StoreWhereUniqueInput
    update?: XOR<XOR<StoreUpdateToOneWithWhereWithoutCollectionsInput, StoreUpdateWithoutCollectionsInput>, StoreUncheckedUpdateWithoutCollectionsInput>
  }

  export type CollectionItemUpdateManyWithoutCollectionNestedInput = {
    create?: XOR<CollectionItemCreateWithoutCollectionInput, CollectionItemUncheckedCreateWithoutCollectionInput> | CollectionItemCreateWithoutCollectionInput[] | CollectionItemUncheckedCreateWithoutCollectionInput[]
    connectOrCreate?: CollectionItemCreateOrConnectWithoutCollectionInput | CollectionItemCreateOrConnectWithoutCollectionInput[]
    upsert?: CollectionItemUpsertWithWhereUniqueWithoutCollectionInput | CollectionItemUpsertWithWhereUniqueWithoutCollectionInput[]
    createMany?: CollectionItemCreateManyCollectionInputEnvelope
    set?: CollectionItemWhereUniqueInput | CollectionItemWhereUniqueInput[]
    disconnect?: CollectionItemWhereUniqueInput | CollectionItemWhereUniqueInput[]
    delete?: CollectionItemWhereUniqueInput | CollectionItemWhereUniqueInput[]
    connect?: CollectionItemWhereUniqueInput | CollectionItemWhereUniqueInput[]
    update?: CollectionItemUpdateWithWhereUniqueWithoutCollectionInput | CollectionItemUpdateWithWhereUniqueWithoutCollectionInput[]
    updateMany?: CollectionItemUpdateManyWithWhereWithoutCollectionInput | CollectionItemUpdateManyWithWhereWithoutCollectionInput[]
    deleteMany?: CollectionItemScalarWhereInput | CollectionItemScalarWhereInput[]
  }

  export type CollectionItemUncheckedUpdateManyWithoutCollectionNestedInput = {
    create?: XOR<CollectionItemCreateWithoutCollectionInput, CollectionItemUncheckedCreateWithoutCollectionInput> | CollectionItemCreateWithoutCollectionInput[] | CollectionItemUncheckedCreateWithoutCollectionInput[]
    connectOrCreate?: CollectionItemCreateOrConnectWithoutCollectionInput | CollectionItemCreateOrConnectWithoutCollectionInput[]
    upsert?: CollectionItemUpsertWithWhereUniqueWithoutCollectionInput | CollectionItemUpsertWithWhereUniqueWithoutCollectionInput[]
    createMany?: CollectionItemCreateManyCollectionInputEnvelope
    set?: CollectionItemWhereUniqueInput | CollectionItemWhereUniqueInput[]
    disconnect?: CollectionItemWhereUniqueInput | CollectionItemWhereUniqueInput[]
    delete?: CollectionItemWhereUniqueInput | CollectionItemWhereUniqueInput[]
    connect?: CollectionItemWhereUniqueInput | CollectionItemWhereUniqueInput[]
    update?: CollectionItemUpdateWithWhereUniqueWithoutCollectionInput | CollectionItemUpdateWithWhereUniqueWithoutCollectionInput[]
    updateMany?: CollectionItemUpdateManyWithWhereWithoutCollectionInput | CollectionItemUpdateManyWithWhereWithoutCollectionInput[]
    deleteMany?: CollectionItemScalarWhereInput | CollectionItemScalarWhereInput[]
  }

  export type CollectionCreateNestedOneWithoutItemsInput = {
    create?: XOR<CollectionCreateWithoutItemsInput, CollectionUncheckedCreateWithoutItemsInput>
    connectOrCreate?: CollectionCreateOrConnectWithoutItemsInput
    connect?: CollectionWhereUniqueInput
  }

  export type CollectionUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<CollectionCreateWithoutItemsInput, CollectionUncheckedCreateWithoutItemsInput>
    connectOrCreate?: CollectionCreateOrConnectWithoutItemsInput
    upsert?: CollectionUpsertWithoutItemsInput
    connect?: CollectionWhereUniqueInput
    update?: XOR<XOR<CollectionUpdateToOneWithWhereWithoutItemsInput, CollectionUpdateWithoutItemsInput>, CollectionUncheckedUpdateWithoutItemsInput>
  }

  export type StoreCreateNestedOneWithoutDataBindingsInput = {
    create?: XOR<StoreCreateWithoutDataBindingsInput, StoreUncheckedCreateWithoutDataBindingsInput>
    connectOrCreate?: StoreCreateOrConnectWithoutDataBindingsInput
    connect?: StoreWhereUniqueInput
  }

  export type StoreUpdateOneRequiredWithoutDataBindingsNestedInput = {
    create?: XOR<StoreCreateWithoutDataBindingsInput, StoreUncheckedCreateWithoutDataBindingsInput>
    connectOrCreate?: StoreCreateOrConnectWithoutDataBindingsInput
    upsert?: StoreUpsertWithoutDataBindingsInput
    connect?: StoreWhereUniqueInput
    update?: XOR<XOR<StoreUpdateToOneWithWhereWithoutDataBindingsInput, StoreUpdateWithoutDataBindingsInput>, StoreUncheckedUpdateWithoutDataBindingsInput>
  }

  export type StoreCreateNestedOneWithoutSnapshotsInput = {
    create?: XOR<StoreCreateWithoutSnapshotsInput, StoreUncheckedCreateWithoutSnapshotsInput>
    connectOrCreate?: StoreCreateOrConnectWithoutSnapshotsInput
    connect?: StoreWhereUniqueInput
  }

  export type StoreUpdateOneRequiredWithoutSnapshotsNestedInput = {
    create?: XOR<StoreCreateWithoutSnapshotsInput, StoreUncheckedCreateWithoutSnapshotsInput>
    connectOrCreate?: StoreCreateOrConnectWithoutSnapshotsInput
    upsert?: StoreUpsertWithoutSnapshotsInput
    connect?: StoreWhereUniqueInput
    update?: XOR<XOR<StoreUpdateToOneWithWhereWithoutSnapshotsInput, StoreUpdateWithoutSnapshotsInput>, StoreUncheckedUpdateWithoutSnapshotsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type StoreStateCreateWithoutThemeInput = {
    activePage?: string
    viewport?: string
    settingsJson: string
    updatedAt?: Date | string
    themeVersion: ThemeVersionCreateNestedOneWithoutStoreStatesInput
    store: StoreCreateNestedOneWithoutStoreStatesInput
  }

  export type StoreStateUncheckedCreateWithoutThemeInput = {
    storeId: string
    themeVersionId: string
    activePage?: string
    viewport?: string
    settingsJson: string
    updatedAt?: Date | string
  }

  export type StoreStateCreateOrConnectWithoutThemeInput = {
    where: StoreStateWhereUniqueInput
    create: XOR<StoreStateCreateWithoutThemeInput, StoreStateUncheckedCreateWithoutThemeInput>
  }

  export type StoreStateCreateManyThemeInputEnvelope = {
    data: StoreStateCreateManyThemeInput | StoreStateCreateManyThemeInput[]
  }

  export type ThemeVersionCreateWithoutThemeInput = {
    id?: string
    version: string
    fsPath: string
    contractJson: string
    capabilitiesJson?: string | null
    schemaHash?: string | null
    createdAt?: Date | string
    storeStates?: StoreStateCreateNestedManyWithoutThemeVersionInput
    stores?: StoreCreateNestedManyWithoutThemeVersionInput
  }

  export type ThemeVersionUncheckedCreateWithoutThemeInput = {
    id?: string
    version: string
    fsPath: string
    contractJson: string
    capabilitiesJson?: string | null
    schemaHash?: string | null
    createdAt?: Date | string
    storeStates?: StoreStateUncheckedCreateNestedManyWithoutThemeVersionInput
    stores?: StoreUncheckedCreateNestedManyWithoutThemeVersionInput
  }

  export type ThemeVersionCreateOrConnectWithoutThemeInput = {
    where: ThemeVersionWhereUniqueInput
    create: XOR<ThemeVersionCreateWithoutThemeInput, ThemeVersionUncheckedCreateWithoutThemeInput>
  }

  export type ThemeVersionCreateManyThemeInputEnvelope = {
    data: ThemeVersionCreateManyThemeInput | ThemeVersionCreateManyThemeInput[]
  }

  export type StoreCreateWithoutThemeInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    themeVersion: ThemeVersionCreateNestedOneWithoutStoresInput
    collections?: CollectionCreateNestedManyWithoutStoreInput
    componentStates?: ComponentStateCreateNestedManyWithoutStoreInput
    dataBindings?: DataBindingCreateNestedManyWithoutStoreInput
    dataEntities?: DataEntityCreateNestedManyWithoutStoreInput
    pageCompositions?: PageCompositionCreateNestedManyWithoutStoreInput
    snapshots?: SnapshotCreateNestedManyWithoutStoreInput
    storeStates?: StoreStateCreateNestedManyWithoutStoreInput
  }

  export type StoreUncheckedCreateWithoutThemeInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    themeVersionId: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    collections?: CollectionUncheckedCreateNestedManyWithoutStoreInput
    componentStates?: ComponentStateUncheckedCreateNestedManyWithoutStoreInput
    dataBindings?: DataBindingUncheckedCreateNestedManyWithoutStoreInput
    dataEntities?: DataEntityUncheckedCreateNestedManyWithoutStoreInput
    pageCompositions?: PageCompositionUncheckedCreateNestedManyWithoutStoreInput
    snapshots?: SnapshotUncheckedCreateNestedManyWithoutStoreInput
    storeStates?: StoreStateUncheckedCreateNestedManyWithoutStoreInput
  }

  export type StoreCreateOrConnectWithoutThemeInput = {
    where: StoreWhereUniqueInput
    create: XOR<StoreCreateWithoutThemeInput, StoreUncheckedCreateWithoutThemeInput>
  }

  export type StoreCreateManyThemeInputEnvelope = {
    data: StoreCreateManyThemeInput | StoreCreateManyThemeInput[]
  }

  export type StoreStateUpsertWithWhereUniqueWithoutThemeInput = {
    where: StoreStateWhereUniqueInput
    update: XOR<StoreStateUpdateWithoutThemeInput, StoreStateUncheckedUpdateWithoutThemeInput>
    create: XOR<StoreStateCreateWithoutThemeInput, StoreStateUncheckedCreateWithoutThemeInput>
  }

  export type StoreStateUpdateWithWhereUniqueWithoutThemeInput = {
    where: StoreStateWhereUniqueInput
    data: XOR<StoreStateUpdateWithoutThemeInput, StoreStateUncheckedUpdateWithoutThemeInput>
  }

  export type StoreStateUpdateManyWithWhereWithoutThemeInput = {
    where: StoreStateScalarWhereInput
    data: XOR<StoreStateUpdateManyMutationInput, StoreStateUncheckedUpdateManyWithoutThemeInput>
  }

  export type StoreStateScalarWhereInput = {
    AND?: StoreStateScalarWhereInput | StoreStateScalarWhereInput[]
    OR?: StoreStateScalarWhereInput[]
    NOT?: StoreStateScalarWhereInput | StoreStateScalarWhereInput[]
    storeId?: StringFilter<"StoreState"> | string
    themeId?: StringFilter<"StoreState"> | string
    themeVersionId?: StringFilter<"StoreState"> | string
    activePage?: StringFilter<"StoreState"> | string
    viewport?: StringFilter<"StoreState"> | string
    settingsJson?: StringFilter<"StoreState"> | string
    updatedAt?: DateTimeFilter<"StoreState"> | Date | string
  }

  export type ThemeVersionUpsertWithWhereUniqueWithoutThemeInput = {
    where: ThemeVersionWhereUniqueInput
    update: XOR<ThemeVersionUpdateWithoutThemeInput, ThemeVersionUncheckedUpdateWithoutThemeInput>
    create: XOR<ThemeVersionCreateWithoutThemeInput, ThemeVersionUncheckedCreateWithoutThemeInput>
  }

  export type ThemeVersionUpdateWithWhereUniqueWithoutThemeInput = {
    where: ThemeVersionWhereUniqueInput
    data: XOR<ThemeVersionUpdateWithoutThemeInput, ThemeVersionUncheckedUpdateWithoutThemeInput>
  }

  export type ThemeVersionUpdateManyWithWhereWithoutThemeInput = {
    where: ThemeVersionScalarWhereInput
    data: XOR<ThemeVersionUpdateManyMutationInput, ThemeVersionUncheckedUpdateManyWithoutThemeInput>
  }

  export type ThemeVersionScalarWhereInput = {
    AND?: ThemeVersionScalarWhereInput | ThemeVersionScalarWhereInput[]
    OR?: ThemeVersionScalarWhereInput[]
    NOT?: ThemeVersionScalarWhereInput | ThemeVersionScalarWhereInput[]
    id?: StringFilter<"ThemeVersion"> | string
    themeId?: StringFilter<"ThemeVersion"> | string
    version?: StringFilter<"ThemeVersion"> | string
    fsPath?: StringFilter<"ThemeVersion"> | string
    contractJson?: StringFilter<"ThemeVersion"> | string
    capabilitiesJson?: StringNullableFilter<"ThemeVersion"> | string | null
    schemaHash?: StringNullableFilter<"ThemeVersion"> | string | null
    createdAt?: DateTimeFilter<"ThemeVersion"> | Date | string
  }

  export type StoreUpsertWithWhereUniqueWithoutThemeInput = {
    where: StoreWhereUniqueInput
    update: XOR<StoreUpdateWithoutThemeInput, StoreUncheckedUpdateWithoutThemeInput>
    create: XOR<StoreCreateWithoutThemeInput, StoreUncheckedCreateWithoutThemeInput>
  }

  export type StoreUpdateWithWhereUniqueWithoutThemeInput = {
    where: StoreWhereUniqueInput
    data: XOR<StoreUpdateWithoutThemeInput, StoreUncheckedUpdateWithoutThemeInput>
  }

  export type StoreUpdateManyWithWhereWithoutThemeInput = {
    where: StoreScalarWhereInput
    data: XOR<StoreUpdateManyMutationInput, StoreUncheckedUpdateManyWithoutThemeInput>
  }

  export type StoreScalarWhereInput = {
    AND?: StoreScalarWhereInput | StoreScalarWhereInput[]
    OR?: StoreScalarWhereInput[]
    NOT?: StoreScalarWhereInput | StoreScalarWhereInput[]
    id?: StringFilter<"Store"> | string
    title?: StringFilter<"Store"> | string
    defaultLocale?: StringFilter<"Store"> | string
    defaultCurrency?: StringFilter<"Store"> | string
    themeId?: StringFilter<"Store"> | string
    themeVersionId?: StringFilter<"Store"> | string
    activePage?: StringFilter<"Store"> | string
    viewport?: StringFilter<"Store"> | string
    settingsJson?: StringFilter<"Store"> | string
    themeSettingsJson?: StringFilter<"Store"> | string
    brandingJson?: StringNullableFilter<"Store"> | string | null
    isMaster?: BoolFilter<"Store"> | boolean
    parentStoreId?: StringNullableFilter<"Store"> | string | null
    createdAt?: DateTimeFilter<"Store"> | Date | string
    updatedAt?: DateTimeFilter<"Store"> | Date | string
  }

  export type StoreStateCreateWithoutThemeVersionInput = {
    activePage?: string
    viewport?: string
    settingsJson: string
    updatedAt?: Date | string
    theme: ThemeCreateNestedOneWithoutStoreStatesInput
    store: StoreCreateNestedOneWithoutStoreStatesInput
  }

  export type StoreStateUncheckedCreateWithoutThemeVersionInput = {
    storeId: string
    themeId: string
    activePage?: string
    viewport?: string
    settingsJson: string
    updatedAt?: Date | string
  }

  export type StoreStateCreateOrConnectWithoutThemeVersionInput = {
    where: StoreStateWhereUniqueInput
    create: XOR<StoreStateCreateWithoutThemeVersionInput, StoreStateUncheckedCreateWithoutThemeVersionInput>
  }

  export type StoreStateCreateManyThemeVersionInputEnvelope = {
    data: StoreStateCreateManyThemeVersionInput | StoreStateCreateManyThemeVersionInput[]
  }

  export type ThemeCreateWithoutVersionsInput = {
    id: string
    nameAr?: string | null
    nameEn?: string | null
    repository?: string | null
    authorEmail?: string | null
    supportUrl?: string | null
    descriptionAr?: string | null
    descriptionEn?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeStates?: StoreStateCreateNestedManyWithoutThemeInput
    stores?: StoreCreateNestedManyWithoutThemeInput
  }

  export type ThemeUncheckedCreateWithoutVersionsInput = {
    id: string
    nameAr?: string | null
    nameEn?: string | null
    repository?: string | null
    authorEmail?: string | null
    supportUrl?: string | null
    descriptionAr?: string | null
    descriptionEn?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeStates?: StoreStateUncheckedCreateNestedManyWithoutThemeInput
    stores?: StoreUncheckedCreateNestedManyWithoutThemeInput
  }

  export type ThemeCreateOrConnectWithoutVersionsInput = {
    where: ThemeWhereUniqueInput
    create: XOR<ThemeCreateWithoutVersionsInput, ThemeUncheckedCreateWithoutVersionsInput>
  }

  export type StoreCreateWithoutThemeVersionInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    theme: ThemeCreateNestedOneWithoutStoresInput
    collections?: CollectionCreateNestedManyWithoutStoreInput
    componentStates?: ComponentStateCreateNestedManyWithoutStoreInput
    dataBindings?: DataBindingCreateNestedManyWithoutStoreInput
    dataEntities?: DataEntityCreateNestedManyWithoutStoreInput
    pageCompositions?: PageCompositionCreateNestedManyWithoutStoreInput
    snapshots?: SnapshotCreateNestedManyWithoutStoreInput
    storeStates?: StoreStateCreateNestedManyWithoutStoreInput
  }

  export type StoreUncheckedCreateWithoutThemeVersionInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    themeId: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    collections?: CollectionUncheckedCreateNestedManyWithoutStoreInput
    componentStates?: ComponentStateUncheckedCreateNestedManyWithoutStoreInput
    dataBindings?: DataBindingUncheckedCreateNestedManyWithoutStoreInput
    dataEntities?: DataEntityUncheckedCreateNestedManyWithoutStoreInput
    pageCompositions?: PageCompositionUncheckedCreateNestedManyWithoutStoreInput
    snapshots?: SnapshotUncheckedCreateNestedManyWithoutStoreInput
    storeStates?: StoreStateUncheckedCreateNestedManyWithoutStoreInput
  }

  export type StoreCreateOrConnectWithoutThemeVersionInput = {
    where: StoreWhereUniqueInput
    create: XOR<StoreCreateWithoutThemeVersionInput, StoreUncheckedCreateWithoutThemeVersionInput>
  }

  export type StoreCreateManyThemeVersionInputEnvelope = {
    data: StoreCreateManyThemeVersionInput | StoreCreateManyThemeVersionInput[]
  }

  export type StoreStateUpsertWithWhereUniqueWithoutThemeVersionInput = {
    where: StoreStateWhereUniqueInput
    update: XOR<StoreStateUpdateWithoutThemeVersionInput, StoreStateUncheckedUpdateWithoutThemeVersionInput>
    create: XOR<StoreStateCreateWithoutThemeVersionInput, StoreStateUncheckedCreateWithoutThemeVersionInput>
  }

  export type StoreStateUpdateWithWhereUniqueWithoutThemeVersionInput = {
    where: StoreStateWhereUniqueInput
    data: XOR<StoreStateUpdateWithoutThemeVersionInput, StoreStateUncheckedUpdateWithoutThemeVersionInput>
  }

  export type StoreStateUpdateManyWithWhereWithoutThemeVersionInput = {
    where: StoreStateScalarWhereInput
    data: XOR<StoreStateUpdateManyMutationInput, StoreStateUncheckedUpdateManyWithoutThemeVersionInput>
  }

  export type ThemeUpsertWithoutVersionsInput = {
    update: XOR<ThemeUpdateWithoutVersionsInput, ThemeUncheckedUpdateWithoutVersionsInput>
    create: XOR<ThemeCreateWithoutVersionsInput, ThemeUncheckedCreateWithoutVersionsInput>
    where?: ThemeWhereInput
  }

  export type ThemeUpdateToOneWithWhereWithoutVersionsInput = {
    where?: ThemeWhereInput
    data: XOR<ThemeUpdateWithoutVersionsInput, ThemeUncheckedUpdateWithoutVersionsInput>
  }

  export type ThemeUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    nameEn?: NullableStringFieldUpdateOperationsInput | string | null
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    authorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    supportUrl?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionAr?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionEn?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeStates?: StoreStateUpdateManyWithoutThemeNestedInput
    stores?: StoreUpdateManyWithoutThemeNestedInput
  }

  export type ThemeUncheckedUpdateWithoutVersionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    nameEn?: NullableStringFieldUpdateOperationsInput | string | null
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    authorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    supportUrl?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionAr?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionEn?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeStates?: StoreStateUncheckedUpdateManyWithoutThemeNestedInput
    stores?: StoreUncheckedUpdateManyWithoutThemeNestedInput
  }

  export type StoreUpsertWithWhereUniqueWithoutThemeVersionInput = {
    where: StoreWhereUniqueInput
    update: XOR<StoreUpdateWithoutThemeVersionInput, StoreUncheckedUpdateWithoutThemeVersionInput>
    create: XOR<StoreCreateWithoutThemeVersionInput, StoreUncheckedCreateWithoutThemeVersionInput>
  }

  export type StoreUpdateWithWhereUniqueWithoutThemeVersionInput = {
    where: StoreWhereUniqueInput
    data: XOR<StoreUpdateWithoutThemeVersionInput, StoreUncheckedUpdateWithoutThemeVersionInput>
  }

  export type StoreUpdateManyWithWhereWithoutThemeVersionInput = {
    where: StoreScalarWhereInput
    data: XOR<StoreUpdateManyMutationInput, StoreUncheckedUpdateManyWithoutThemeVersionInput>
  }

  export type ThemeCreateWithoutStoresInput = {
    id: string
    nameAr?: string | null
    nameEn?: string | null
    repository?: string | null
    authorEmail?: string | null
    supportUrl?: string | null
    descriptionAr?: string | null
    descriptionEn?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeStates?: StoreStateCreateNestedManyWithoutThemeInput
    versions?: ThemeVersionCreateNestedManyWithoutThemeInput
  }

  export type ThemeUncheckedCreateWithoutStoresInput = {
    id: string
    nameAr?: string | null
    nameEn?: string | null
    repository?: string | null
    authorEmail?: string | null
    supportUrl?: string | null
    descriptionAr?: string | null
    descriptionEn?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    storeStates?: StoreStateUncheckedCreateNestedManyWithoutThemeInput
    versions?: ThemeVersionUncheckedCreateNestedManyWithoutThemeInput
  }

  export type ThemeCreateOrConnectWithoutStoresInput = {
    where: ThemeWhereUniqueInput
    create: XOR<ThemeCreateWithoutStoresInput, ThemeUncheckedCreateWithoutStoresInput>
  }

  export type ThemeVersionCreateWithoutStoresInput = {
    id?: string
    version: string
    fsPath: string
    contractJson: string
    capabilitiesJson?: string | null
    schemaHash?: string | null
    createdAt?: Date | string
    storeStates?: StoreStateCreateNestedManyWithoutThemeVersionInput
    theme: ThemeCreateNestedOneWithoutVersionsInput
  }

  export type ThemeVersionUncheckedCreateWithoutStoresInput = {
    id?: string
    themeId: string
    version: string
    fsPath: string
    contractJson: string
    capabilitiesJson?: string | null
    schemaHash?: string | null
    createdAt?: Date | string
    storeStates?: StoreStateUncheckedCreateNestedManyWithoutThemeVersionInput
  }

  export type ThemeVersionCreateOrConnectWithoutStoresInput = {
    where: ThemeVersionWhereUniqueInput
    create: XOR<ThemeVersionCreateWithoutStoresInput, ThemeVersionUncheckedCreateWithoutStoresInput>
  }

  export type CollectionCreateWithoutStoreInput = {
    id?: string
    name: string
    source: string
    rulesJson?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: CollectionItemCreateNestedManyWithoutCollectionInput
  }

  export type CollectionUncheckedCreateWithoutStoreInput = {
    id?: string
    name: string
    source: string
    rulesJson?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: CollectionItemUncheckedCreateNestedManyWithoutCollectionInput
  }

  export type CollectionCreateOrConnectWithoutStoreInput = {
    where: CollectionWhereUniqueInput
    create: XOR<CollectionCreateWithoutStoreInput, CollectionUncheckedCreateWithoutStoreInput>
  }

  export type CollectionCreateManyStoreInputEnvelope = {
    data: CollectionCreateManyStoreInput | CollectionCreateManyStoreInput[]
  }

  export type ComponentStateCreateWithoutStoreInput = {
    id?: string
    componentPath: string
    componentKey?: string | null
    instanceOrder: number
    settingsJson: string
    visibilityJson?: string | null
    updatedAt?: Date | string
  }

  export type ComponentStateUncheckedCreateWithoutStoreInput = {
    id?: string
    componentPath: string
    componentKey?: string | null
    instanceOrder: number
    settingsJson: string
    visibilityJson?: string | null
    updatedAt?: Date | string
  }

  export type ComponentStateCreateOrConnectWithoutStoreInput = {
    where: ComponentStateWhereUniqueInput
    create: XOR<ComponentStateCreateWithoutStoreInput, ComponentStateUncheckedCreateWithoutStoreInput>
  }

  export type ComponentStateCreateManyStoreInputEnvelope = {
    data: ComponentStateCreateManyStoreInput | ComponentStateCreateManyStoreInput[]
  }

  export type DataBindingCreateWithoutStoreInput = {
    id?: string
    componentPath: string
    bindingKey: string
    sourceType: string
    sourceRef: string
    bindingJson?: string | null
    updatedAt?: Date | string
  }

  export type DataBindingUncheckedCreateWithoutStoreInput = {
    id?: string
    componentPath: string
    bindingKey: string
    sourceType: string
    sourceRef: string
    bindingJson?: string | null
    updatedAt?: Date | string
  }

  export type DataBindingCreateOrConnectWithoutStoreInput = {
    where: DataBindingWhereUniqueInput
    create: XOR<DataBindingCreateWithoutStoreInput, DataBindingUncheckedCreateWithoutStoreInput>
  }

  export type DataBindingCreateManyStoreInputEnvelope = {
    data: DataBindingCreateManyStoreInput | DataBindingCreateManyStoreInput[]
  }

  export type DataEntityCreateWithoutStoreInput = {
    id?: string
    entityType: string
    entityKey?: string | null
    payloadJson: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DataEntityUncheckedCreateWithoutStoreInput = {
    id?: string
    entityType: string
    entityKey?: string | null
    payloadJson: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DataEntityCreateOrConnectWithoutStoreInput = {
    where: DataEntityWhereUniqueInput
    create: XOR<DataEntityCreateWithoutStoreInput, DataEntityUncheckedCreateWithoutStoreInput>
  }

  export type DataEntityCreateManyStoreInputEnvelope = {
    data: DataEntityCreateManyStoreInput | DataEntityCreateManyStoreInput[]
  }

  export type PageCompositionCreateWithoutStoreInput = {
    id?: string
    page: string
    compositionJson: string
    updatedAt?: Date | string
  }

  export type PageCompositionUncheckedCreateWithoutStoreInput = {
    id?: string
    page: string
    compositionJson: string
    updatedAt?: Date | string
  }

  export type PageCompositionCreateOrConnectWithoutStoreInput = {
    where: PageCompositionWhereUniqueInput
    create: XOR<PageCompositionCreateWithoutStoreInput, PageCompositionUncheckedCreateWithoutStoreInput>
  }

  export type PageCompositionCreateManyStoreInputEnvelope = {
    data: PageCompositionCreateManyStoreInput | PageCompositionCreateManyStoreInput[]
  }

  export type SnapshotCreateWithoutStoreInput = {
    id?: string
    label: string
    snapshotJson: string
    createdAt?: Date | string
  }

  export type SnapshotUncheckedCreateWithoutStoreInput = {
    id?: string
    label: string
    snapshotJson: string
    createdAt?: Date | string
  }

  export type SnapshotCreateOrConnectWithoutStoreInput = {
    where: SnapshotWhereUniqueInput
    create: XOR<SnapshotCreateWithoutStoreInput, SnapshotUncheckedCreateWithoutStoreInput>
  }

  export type SnapshotCreateManyStoreInputEnvelope = {
    data: SnapshotCreateManyStoreInput | SnapshotCreateManyStoreInput[]
  }

  export type StoreStateCreateWithoutStoreInput = {
    activePage?: string
    viewport?: string
    settingsJson: string
    updatedAt?: Date | string
    themeVersion: ThemeVersionCreateNestedOneWithoutStoreStatesInput
    theme: ThemeCreateNestedOneWithoutStoreStatesInput
  }

  export type StoreStateUncheckedCreateWithoutStoreInput = {
    themeId: string
    themeVersionId: string
    activePage?: string
    viewport?: string
    settingsJson: string
    updatedAt?: Date | string
  }

  export type StoreStateCreateOrConnectWithoutStoreInput = {
    where: StoreStateWhereUniqueInput
    create: XOR<StoreStateCreateWithoutStoreInput, StoreStateUncheckedCreateWithoutStoreInput>
  }

  export type StoreStateCreateManyStoreInputEnvelope = {
    data: StoreStateCreateManyStoreInput | StoreStateCreateManyStoreInput[]
  }

  export type ThemeUpsertWithoutStoresInput = {
    update: XOR<ThemeUpdateWithoutStoresInput, ThemeUncheckedUpdateWithoutStoresInput>
    create: XOR<ThemeCreateWithoutStoresInput, ThemeUncheckedCreateWithoutStoresInput>
    where?: ThemeWhereInput
  }

  export type ThemeUpdateToOneWithWhereWithoutStoresInput = {
    where?: ThemeWhereInput
    data: XOR<ThemeUpdateWithoutStoresInput, ThemeUncheckedUpdateWithoutStoresInput>
  }

  export type ThemeUpdateWithoutStoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    nameEn?: NullableStringFieldUpdateOperationsInput | string | null
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    authorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    supportUrl?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionAr?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionEn?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeStates?: StoreStateUpdateManyWithoutThemeNestedInput
    versions?: ThemeVersionUpdateManyWithoutThemeNestedInput
  }

  export type ThemeUncheckedUpdateWithoutStoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    nameEn?: NullableStringFieldUpdateOperationsInput | string | null
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    authorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    supportUrl?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionAr?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionEn?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeStates?: StoreStateUncheckedUpdateManyWithoutThemeNestedInput
    versions?: ThemeVersionUncheckedUpdateManyWithoutThemeNestedInput
  }

  export type ThemeVersionUpsertWithoutStoresInput = {
    update: XOR<ThemeVersionUpdateWithoutStoresInput, ThemeVersionUncheckedUpdateWithoutStoresInput>
    create: XOR<ThemeVersionCreateWithoutStoresInput, ThemeVersionUncheckedCreateWithoutStoresInput>
    where?: ThemeVersionWhereInput
  }

  export type ThemeVersionUpdateToOneWithWhereWithoutStoresInput = {
    where?: ThemeVersionWhereInput
    data: XOR<ThemeVersionUpdateWithoutStoresInput, ThemeVersionUncheckedUpdateWithoutStoresInput>
  }

  export type ThemeVersionUpdateWithoutStoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    fsPath?: StringFieldUpdateOperationsInput | string
    contractJson?: StringFieldUpdateOperationsInput | string
    capabilitiesJson?: NullableStringFieldUpdateOperationsInput | string | null
    schemaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeStates?: StoreStateUpdateManyWithoutThemeVersionNestedInput
    theme?: ThemeUpdateOneRequiredWithoutVersionsNestedInput
  }

  export type ThemeVersionUncheckedUpdateWithoutStoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    fsPath?: StringFieldUpdateOperationsInput | string
    contractJson?: StringFieldUpdateOperationsInput | string
    capabilitiesJson?: NullableStringFieldUpdateOperationsInput | string | null
    schemaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeStates?: StoreStateUncheckedUpdateManyWithoutThemeVersionNestedInput
  }

  export type CollectionUpsertWithWhereUniqueWithoutStoreInput = {
    where: CollectionWhereUniqueInput
    update: XOR<CollectionUpdateWithoutStoreInput, CollectionUncheckedUpdateWithoutStoreInput>
    create: XOR<CollectionCreateWithoutStoreInput, CollectionUncheckedCreateWithoutStoreInput>
  }

  export type CollectionUpdateWithWhereUniqueWithoutStoreInput = {
    where: CollectionWhereUniqueInput
    data: XOR<CollectionUpdateWithoutStoreInput, CollectionUncheckedUpdateWithoutStoreInput>
  }

  export type CollectionUpdateManyWithWhereWithoutStoreInput = {
    where: CollectionScalarWhereInput
    data: XOR<CollectionUpdateManyMutationInput, CollectionUncheckedUpdateManyWithoutStoreInput>
  }

  export type CollectionScalarWhereInput = {
    AND?: CollectionScalarWhereInput | CollectionScalarWhereInput[]
    OR?: CollectionScalarWhereInput[]
    NOT?: CollectionScalarWhereInput | CollectionScalarWhereInput[]
    id?: StringFilter<"Collection"> | string
    storeId?: StringFilter<"Collection"> | string
    name?: StringFilter<"Collection"> | string
    source?: StringFilter<"Collection"> | string
    rulesJson?: StringNullableFilter<"Collection"> | string | null
    createdAt?: DateTimeFilter<"Collection"> | Date | string
    updatedAt?: DateTimeFilter<"Collection"> | Date | string
  }

  export type ComponentStateUpsertWithWhereUniqueWithoutStoreInput = {
    where: ComponentStateWhereUniqueInput
    update: XOR<ComponentStateUpdateWithoutStoreInput, ComponentStateUncheckedUpdateWithoutStoreInput>
    create: XOR<ComponentStateCreateWithoutStoreInput, ComponentStateUncheckedCreateWithoutStoreInput>
  }

  export type ComponentStateUpdateWithWhereUniqueWithoutStoreInput = {
    where: ComponentStateWhereUniqueInput
    data: XOR<ComponentStateUpdateWithoutStoreInput, ComponentStateUncheckedUpdateWithoutStoreInput>
  }

  export type ComponentStateUpdateManyWithWhereWithoutStoreInput = {
    where: ComponentStateScalarWhereInput
    data: XOR<ComponentStateUpdateManyMutationInput, ComponentStateUncheckedUpdateManyWithoutStoreInput>
  }

  export type ComponentStateScalarWhereInput = {
    AND?: ComponentStateScalarWhereInput | ComponentStateScalarWhereInput[]
    OR?: ComponentStateScalarWhereInput[]
    NOT?: ComponentStateScalarWhereInput | ComponentStateScalarWhereInput[]
    id?: StringFilter<"ComponentState"> | string
    storeId?: StringFilter<"ComponentState"> | string
    componentPath?: StringFilter<"ComponentState"> | string
    componentKey?: StringNullableFilter<"ComponentState"> | string | null
    instanceOrder?: IntFilter<"ComponentState"> | number
    settingsJson?: StringFilter<"ComponentState"> | string
    visibilityJson?: StringNullableFilter<"ComponentState"> | string | null
    updatedAt?: DateTimeFilter<"ComponentState"> | Date | string
  }

  export type DataBindingUpsertWithWhereUniqueWithoutStoreInput = {
    where: DataBindingWhereUniqueInput
    update: XOR<DataBindingUpdateWithoutStoreInput, DataBindingUncheckedUpdateWithoutStoreInput>
    create: XOR<DataBindingCreateWithoutStoreInput, DataBindingUncheckedCreateWithoutStoreInput>
  }

  export type DataBindingUpdateWithWhereUniqueWithoutStoreInput = {
    where: DataBindingWhereUniqueInput
    data: XOR<DataBindingUpdateWithoutStoreInput, DataBindingUncheckedUpdateWithoutStoreInput>
  }

  export type DataBindingUpdateManyWithWhereWithoutStoreInput = {
    where: DataBindingScalarWhereInput
    data: XOR<DataBindingUpdateManyMutationInput, DataBindingUncheckedUpdateManyWithoutStoreInput>
  }

  export type DataBindingScalarWhereInput = {
    AND?: DataBindingScalarWhereInput | DataBindingScalarWhereInput[]
    OR?: DataBindingScalarWhereInput[]
    NOT?: DataBindingScalarWhereInput | DataBindingScalarWhereInput[]
    id?: StringFilter<"DataBinding"> | string
    storeId?: StringFilter<"DataBinding"> | string
    componentPath?: StringFilter<"DataBinding"> | string
    bindingKey?: StringFilter<"DataBinding"> | string
    sourceType?: StringFilter<"DataBinding"> | string
    sourceRef?: StringFilter<"DataBinding"> | string
    bindingJson?: StringNullableFilter<"DataBinding"> | string | null
    updatedAt?: DateTimeFilter<"DataBinding"> | Date | string
  }

  export type DataEntityUpsertWithWhereUniqueWithoutStoreInput = {
    where: DataEntityWhereUniqueInput
    update: XOR<DataEntityUpdateWithoutStoreInput, DataEntityUncheckedUpdateWithoutStoreInput>
    create: XOR<DataEntityCreateWithoutStoreInput, DataEntityUncheckedCreateWithoutStoreInput>
  }

  export type DataEntityUpdateWithWhereUniqueWithoutStoreInput = {
    where: DataEntityWhereUniqueInput
    data: XOR<DataEntityUpdateWithoutStoreInput, DataEntityUncheckedUpdateWithoutStoreInput>
  }

  export type DataEntityUpdateManyWithWhereWithoutStoreInput = {
    where: DataEntityScalarWhereInput
    data: XOR<DataEntityUpdateManyMutationInput, DataEntityUncheckedUpdateManyWithoutStoreInput>
  }

  export type DataEntityScalarWhereInput = {
    AND?: DataEntityScalarWhereInput | DataEntityScalarWhereInput[]
    OR?: DataEntityScalarWhereInput[]
    NOT?: DataEntityScalarWhereInput | DataEntityScalarWhereInput[]
    id?: StringFilter<"DataEntity"> | string
    storeId?: StringFilter<"DataEntity"> | string
    entityType?: StringFilter<"DataEntity"> | string
    entityKey?: StringNullableFilter<"DataEntity"> | string | null
    payloadJson?: StringFilter<"DataEntity"> | string
    createdAt?: DateTimeFilter<"DataEntity"> | Date | string
    updatedAt?: DateTimeFilter<"DataEntity"> | Date | string
  }

  export type PageCompositionUpsertWithWhereUniqueWithoutStoreInput = {
    where: PageCompositionWhereUniqueInput
    update: XOR<PageCompositionUpdateWithoutStoreInput, PageCompositionUncheckedUpdateWithoutStoreInput>
    create: XOR<PageCompositionCreateWithoutStoreInput, PageCompositionUncheckedCreateWithoutStoreInput>
  }

  export type PageCompositionUpdateWithWhereUniqueWithoutStoreInput = {
    where: PageCompositionWhereUniqueInput
    data: XOR<PageCompositionUpdateWithoutStoreInput, PageCompositionUncheckedUpdateWithoutStoreInput>
  }

  export type PageCompositionUpdateManyWithWhereWithoutStoreInput = {
    where: PageCompositionScalarWhereInput
    data: XOR<PageCompositionUpdateManyMutationInput, PageCompositionUncheckedUpdateManyWithoutStoreInput>
  }

  export type PageCompositionScalarWhereInput = {
    AND?: PageCompositionScalarWhereInput | PageCompositionScalarWhereInput[]
    OR?: PageCompositionScalarWhereInput[]
    NOT?: PageCompositionScalarWhereInput | PageCompositionScalarWhereInput[]
    id?: StringFilter<"PageComposition"> | string
    storeId?: StringFilter<"PageComposition"> | string
    page?: StringFilter<"PageComposition"> | string
    compositionJson?: StringFilter<"PageComposition"> | string
    updatedAt?: DateTimeFilter<"PageComposition"> | Date | string
  }

  export type SnapshotUpsertWithWhereUniqueWithoutStoreInput = {
    where: SnapshotWhereUniqueInput
    update: XOR<SnapshotUpdateWithoutStoreInput, SnapshotUncheckedUpdateWithoutStoreInput>
    create: XOR<SnapshotCreateWithoutStoreInput, SnapshotUncheckedCreateWithoutStoreInput>
  }

  export type SnapshotUpdateWithWhereUniqueWithoutStoreInput = {
    where: SnapshotWhereUniqueInput
    data: XOR<SnapshotUpdateWithoutStoreInput, SnapshotUncheckedUpdateWithoutStoreInput>
  }

  export type SnapshotUpdateManyWithWhereWithoutStoreInput = {
    where: SnapshotScalarWhereInput
    data: XOR<SnapshotUpdateManyMutationInput, SnapshotUncheckedUpdateManyWithoutStoreInput>
  }

  export type SnapshotScalarWhereInput = {
    AND?: SnapshotScalarWhereInput | SnapshotScalarWhereInput[]
    OR?: SnapshotScalarWhereInput[]
    NOT?: SnapshotScalarWhereInput | SnapshotScalarWhereInput[]
    id?: StringFilter<"Snapshot"> | string
    storeId?: StringFilter<"Snapshot"> | string
    label?: StringFilter<"Snapshot"> | string
    snapshotJson?: StringFilter<"Snapshot"> | string
    createdAt?: DateTimeFilter<"Snapshot"> | Date | string
  }

  export type StoreStateUpsertWithWhereUniqueWithoutStoreInput = {
    where: StoreStateWhereUniqueInput
    update: XOR<StoreStateUpdateWithoutStoreInput, StoreStateUncheckedUpdateWithoutStoreInput>
    create: XOR<StoreStateCreateWithoutStoreInput, StoreStateUncheckedCreateWithoutStoreInput>
  }

  export type StoreStateUpdateWithWhereUniqueWithoutStoreInput = {
    where: StoreStateWhereUniqueInput
    data: XOR<StoreStateUpdateWithoutStoreInput, StoreStateUncheckedUpdateWithoutStoreInput>
  }

  export type StoreStateUpdateManyWithWhereWithoutStoreInput = {
    where: StoreStateScalarWhereInput
    data: XOR<StoreStateUpdateManyMutationInput, StoreStateUncheckedUpdateManyWithoutStoreInput>
  }

  export type ThemeVersionCreateWithoutStoreStatesInput = {
    id?: string
    version: string
    fsPath: string
    contractJson: string
    capabilitiesJson?: string | null
    schemaHash?: string | null
    createdAt?: Date | string
    theme: ThemeCreateNestedOneWithoutVersionsInput
    stores?: StoreCreateNestedManyWithoutThemeVersionInput
  }

  export type ThemeVersionUncheckedCreateWithoutStoreStatesInput = {
    id?: string
    themeId: string
    version: string
    fsPath: string
    contractJson: string
    capabilitiesJson?: string | null
    schemaHash?: string | null
    createdAt?: Date | string
    stores?: StoreUncheckedCreateNestedManyWithoutThemeVersionInput
  }

  export type ThemeVersionCreateOrConnectWithoutStoreStatesInput = {
    where: ThemeVersionWhereUniqueInput
    create: XOR<ThemeVersionCreateWithoutStoreStatesInput, ThemeVersionUncheckedCreateWithoutStoreStatesInput>
  }

  export type ThemeCreateWithoutStoreStatesInput = {
    id: string
    nameAr?: string | null
    nameEn?: string | null
    repository?: string | null
    authorEmail?: string | null
    supportUrl?: string | null
    descriptionAr?: string | null
    descriptionEn?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    versions?: ThemeVersionCreateNestedManyWithoutThemeInput
    stores?: StoreCreateNestedManyWithoutThemeInput
  }

  export type ThemeUncheckedCreateWithoutStoreStatesInput = {
    id: string
    nameAr?: string | null
    nameEn?: string | null
    repository?: string | null
    authorEmail?: string | null
    supportUrl?: string | null
    descriptionAr?: string | null
    descriptionEn?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    versions?: ThemeVersionUncheckedCreateNestedManyWithoutThemeInput
    stores?: StoreUncheckedCreateNestedManyWithoutThemeInput
  }

  export type ThemeCreateOrConnectWithoutStoreStatesInput = {
    where: ThemeWhereUniqueInput
    create: XOR<ThemeCreateWithoutStoreStatesInput, ThemeUncheckedCreateWithoutStoreStatesInput>
  }

  export type StoreCreateWithoutStoreStatesInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    theme: ThemeCreateNestedOneWithoutStoresInput
    themeVersion: ThemeVersionCreateNestedOneWithoutStoresInput
    collections?: CollectionCreateNestedManyWithoutStoreInput
    componentStates?: ComponentStateCreateNestedManyWithoutStoreInput
    dataBindings?: DataBindingCreateNestedManyWithoutStoreInput
    dataEntities?: DataEntityCreateNestedManyWithoutStoreInput
    pageCompositions?: PageCompositionCreateNestedManyWithoutStoreInput
    snapshots?: SnapshotCreateNestedManyWithoutStoreInput
  }

  export type StoreUncheckedCreateWithoutStoreStatesInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    themeId: string
    themeVersionId: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    collections?: CollectionUncheckedCreateNestedManyWithoutStoreInput
    componentStates?: ComponentStateUncheckedCreateNestedManyWithoutStoreInput
    dataBindings?: DataBindingUncheckedCreateNestedManyWithoutStoreInput
    dataEntities?: DataEntityUncheckedCreateNestedManyWithoutStoreInput
    pageCompositions?: PageCompositionUncheckedCreateNestedManyWithoutStoreInput
    snapshots?: SnapshotUncheckedCreateNestedManyWithoutStoreInput
  }

  export type StoreCreateOrConnectWithoutStoreStatesInput = {
    where: StoreWhereUniqueInput
    create: XOR<StoreCreateWithoutStoreStatesInput, StoreUncheckedCreateWithoutStoreStatesInput>
  }

  export type ThemeVersionUpsertWithoutStoreStatesInput = {
    update: XOR<ThemeVersionUpdateWithoutStoreStatesInput, ThemeVersionUncheckedUpdateWithoutStoreStatesInput>
    create: XOR<ThemeVersionCreateWithoutStoreStatesInput, ThemeVersionUncheckedCreateWithoutStoreStatesInput>
    where?: ThemeVersionWhereInput
  }

  export type ThemeVersionUpdateToOneWithWhereWithoutStoreStatesInput = {
    where?: ThemeVersionWhereInput
    data: XOR<ThemeVersionUpdateWithoutStoreStatesInput, ThemeVersionUncheckedUpdateWithoutStoreStatesInput>
  }

  export type ThemeVersionUpdateWithoutStoreStatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    fsPath?: StringFieldUpdateOperationsInput | string
    contractJson?: StringFieldUpdateOperationsInput | string
    capabilitiesJson?: NullableStringFieldUpdateOperationsInput | string | null
    schemaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    theme?: ThemeUpdateOneRequiredWithoutVersionsNestedInput
    stores?: StoreUpdateManyWithoutThemeVersionNestedInput
  }

  export type ThemeVersionUncheckedUpdateWithoutStoreStatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    fsPath?: StringFieldUpdateOperationsInput | string
    contractJson?: StringFieldUpdateOperationsInput | string
    capabilitiesJson?: NullableStringFieldUpdateOperationsInput | string | null
    schemaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    stores?: StoreUncheckedUpdateManyWithoutThemeVersionNestedInput
  }

  export type ThemeUpsertWithoutStoreStatesInput = {
    update: XOR<ThemeUpdateWithoutStoreStatesInput, ThemeUncheckedUpdateWithoutStoreStatesInput>
    create: XOR<ThemeCreateWithoutStoreStatesInput, ThemeUncheckedCreateWithoutStoreStatesInput>
    where?: ThemeWhereInput
  }

  export type ThemeUpdateToOneWithWhereWithoutStoreStatesInput = {
    where?: ThemeWhereInput
    data: XOR<ThemeUpdateWithoutStoreStatesInput, ThemeUncheckedUpdateWithoutStoreStatesInput>
  }

  export type ThemeUpdateWithoutStoreStatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    nameEn?: NullableStringFieldUpdateOperationsInput | string | null
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    authorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    supportUrl?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionAr?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionEn?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versions?: ThemeVersionUpdateManyWithoutThemeNestedInput
    stores?: StoreUpdateManyWithoutThemeNestedInput
  }

  export type ThemeUncheckedUpdateWithoutStoreStatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    nameAr?: NullableStringFieldUpdateOperationsInput | string | null
    nameEn?: NullableStringFieldUpdateOperationsInput | string | null
    repository?: NullableStringFieldUpdateOperationsInput | string | null
    authorEmail?: NullableStringFieldUpdateOperationsInput | string | null
    supportUrl?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionAr?: NullableStringFieldUpdateOperationsInput | string | null
    descriptionEn?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    versions?: ThemeVersionUncheckedUpdateManyWithoutThemeNestedInput
    stores?: StoreUncheckedUpdateManyWithoutThemeNestedInput
  }

  export type StoreUpsertWithoutStoreStatesInput = {
    update: XOR<StoreUpdateWithoutStoreStatesInput, StoreUncheckedUpdateWithoutStoreStatesInput>
    create: XOR<StoreCreateWithoutStoreStatesInput, StoreUncheckedCreateWithoutStoreStatesInput>
    where?: StoreWhereInput
  }

  export type StoreUpdateToOneWithWhereWithoutStoreStatesInput = {
    where?: StoreWhereInput
    data: XOR<StoreUpdateWithoutStoreStatesInput, StoreUncheckedUpdateWithoutStoreStatesInput>
  }

  export type StoreUpdateWithoutStoreStatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    theme?: ThemeUpdateOneRequiredWithoutStoresNestedInput
    themeVersion?: ThemeVersionUpdateOneRequiredWithoutStoresNestedInput
    collections?: CollectionUpdateManyWithoutStoreNestedInput
    componentStates?: ComponentStateUpdateManyWithoutStoreNestedInput
    dataBindings?: DataBindingUpdateManyWithoutStoreNestedInput
    dataEntities?: DataEntityUpdateManyWithoutStoreNestedInput
    pageCompositions?: PageCompositionUpdateManyWithoutStoreNestedInput
    snapshots?: SnapshotUpdateManyWithoutStoreNestedInput
  }

  export type StoreUncheckedUpdateWithoutStoreStatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    themeVersionId?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collections?: CollectionUncheckedUpdateManyWithoutStoreNestedInput
    componentStates?: ComponentStateUncheckedUpdateManyWithoutStoreNestedInput
    dataBindings?: DataBindingUncheckedUpdateManyWithoutStoreNestedInput
    dataEntities?: DataEntityUncheckedUpdateManyWithoutStoreNestedInput
    pageCompositions?: PageCompositionUncheckedUpdateManyWithoutStoreNestedInput
    snapshots?: SnapshotUncheckedUpdateManyWithoutStoreNestedInput
  }

  export type StoreCreateWithoutComponentStatesInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    theme: ThemeCreateNestedOneWithoutStoresInput
    themeVersion: ThemeVersionCreateNestedOneWithoutStoresInput
    collections?: CollectionCreateNestedManyWithoutStoreInput
    dataBindings?: DataBindingCreateNestedManyWithoutStoreInput
    dataEntities?: DataEntityCreateNestedManyWithoutStoreInput
    pageCompositions?: PageCompositionCreateNestedManyWithoutStoreInput
    snapshots?: SnapshotCreateNestedManyWithoutStoreInput
    storeStates?: StoreStateCreateNestedManyWithoutStoreInput
  }

  export type StoreUncheckedCreateWithoutComponentStatesInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    themeId: string
    themeVersionId: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    collections?: CollectionUncheckedCreateNestedManyWithoutStoreInput
    dataBindings?: DataBindingUncheckedCreateNestedManyWithoutStoreInput
    dataEntities?: DataEntityUncheckedCreateNestedManyWithoutStoreInput
    pageCompositions?: PageCompositionUncheckedCreateNestedManyWithoutStoreInput
    snapshots?: SnapshotUncheckedCreateNestedManyWithoutStoreInput
    storeStates?: StoreStateUncheckedCreateNestedManyWithoutStoreInput
  }

  export type StoreCreateOrConnectWithoutComponentStatesInput = {
    where: StoreWhereUniqueInput
    create: XOR<StoreCreateWithoutComponentStatesInput, StoreUncheckedCreateWithoutComponentStatesInput>
  }

  export type StoreUpsertWithoutComponentStatesInput = {
    update: XOR<StoreUpdateWithoutComponentStatesInput, StoreUncheckedUpdateWithoutComponentStatesInput>
    create: XOR<StoreCreateWithoutComponentStatesInput, StoreUncheckedCreateWithoutComponentStatesInput>
    where?: StoreWhereInput
  }

  export type StoreUpdateToOneWithWhereWithoutComponentStatesInput = {
    where?: StoreWhereInput
    data: XOR<StoreUpdateWithoutComponentStatesInput, StoreUncheckedUpdateWithoutComponentStatesInput>
  }

  export type StoreUpdateWithoutComponentStatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    theme?: ThemeUpdateOneRequiredWithoutStoresNestedInput
    themeVersion?: ThemeVersionUpdateOneRequiredWithoutStoresNestedInput
    collections?: CollectionUpdateManyWithoutStoreNestedInput
    dataBindings?: DataBindingUpdateManyWithoutStoreNestedInput
    dataEntities?: DataEntityUpdateManyWithoutStoreNestedInput
    pageCompositions?: PageCompositionUpdateManyWithoutStoreNestedInput
    snapshots?: SnapshotUpdateManyWithoutStoreNestedInput
    storeStates?: StoreStateUpdateManyWithoutStoreNestedInput
  }

  export type StoreUncheckedUpdateWithoutComponentStatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    themeVersionId?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collections?: CollectionUncheckedUpdateManyWithoutStoreNestedInput
    dataBindings?: DataBindingUncheckedUpdateManyWithoutStoreNestedInput
    dataEntities?: DataEntityUncheckedUpdateManyWithoutStoreNestedInput
    pageCompositions?: PageCompositionUncheckedUpdateManyWithoutStoreNestedInput
    snapshots?: SnapshotUncheckedUpdateManyWithoutStoreNestedInput
    storeStates?: StoreStateUncheckedUpdateManyWithoutStoreNestedInput
  }

  export type StoreCreateWithoutPageCompositionsInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    theme: ThemeCreateNestedOneWithoutStoresInput
    themeVersion: ThemeVersionCreateNestedOneWithoutStoresInput
    collections?: CollectionCreateNestedManyWithoutStoreInput
    componentStates?: ComponentStateCreateNestedManyWithoutStoreInput
    dataBindings?: DataBindingCreateNestedManyWithoutStoreInput
    dataEntities?: DataEntityCreateNestedManyWithoutStoreInput
    snapshots?: SnapshotCreateNestedManyWithoutStoreInput
    storeStates?: StoreStateCreateNestedManyWithoutStoreInput
  }

  export type StoreUncheckedCreateWithoutPageCompositionsInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    themeId: string
    themeVersionId: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    collections?: CollectionUncheckedCreateNestedManyWithoutStoreInput
    componentStates?: ComponentStateUncheckedCreateNestedManyWithoutStoreInput
    dataBindings?: DataBindingUncheckedCreateNestedManyWithoutStoreInput
    dataEntities?: DataEntityUncheckedCreateNestedManyWithoutStoreInput
    snapshots?: SnapshotUncheckedCreateNestedManyWithoutStoreInput
    storeStates?: StoreStateUncheckedCreateNestedManyWithoutStoreInput
  }

  export type StoreCreateOrConnectWithoutPageCompositionsInput = {
    where: StoreWhereUniqueInput
    create: XOR<StoreCreateWithoutPageCompositionsInput, StoreUncheckedCreateWithoutPageCompositionsInput>
  }

  export type StoreUpsertWithoutPageCompositionsInput = {
    update: XOR<StoreUpdateWithoutPageCompositionsInput, StoreUncheckedUpdateWithoutPageCompositionsInput>
    create: XOR<StoreCreateWithoutPageCompositionsInput, StoreUncheckedCreateWithoutPageCompositionsInput>
    where?: StoreWhereInput
  }

  export type StoreUpdateToOneWithWhereWithoutPageCompositionsInput = {
    where?: StoreWhereInput
    data: XOR<StoreUpdateWithoutPageCompositionsInput, StoreUncheckedUpdateWithoutPageCompositionsInput>
  }

  export type StoreUpdateWithoutPageCompositionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    theme?: ThemeUpdateOneRequiredWithoutStoresNestedInput
    themeVersion?: ThemeVersionUpdateOneRequiredWithoutStoresNestedInput
    collections?: CollectionUpdateManyWithoutStoreNestedInput
    componentStates?: ComponentStateUpdateManyWithoutStoreNestedInput
    dataBindings?: DataBindingUpdateManyWithoutStoreNestedInput
    dataEntities?: DataEntityUpdateManyWithoutStoreNestedInput
    snapshots?: SnapshotUpdateManyWithoutStoreNestedInput
    storeStates?: StoreStateUpdateManyWithoutStoreNestedInput
  }

  export type StoreUncheckedUpdateWithoutPageCompositionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    themeVersionId?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collections?: CollectionUncheckedUpdateManyWithoutStoreNestedInput
    componentStates?: ComponentStateUncheckedUpdateManyWithoutStoreNestedInput
    dataBindings?: DataBindingUncheckedUpdateManyWithoutStoreNestedInput
    dataEntities?: DataEntityUncheckedUpdateManyWithoutStoreNestedInput
    snapshots?: SnapshotUncheckedUpdateManyWithoutStoreNestedInput
    storeStates?: StoreStateUncheckedUpdateManyWithoutStoreNestedInput
  }

  export type StoreCreateWithoutDataEntitiesInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    theme: ThemeCreateNestedOneWithoutStoresInput
    themeVersion: ThemeVersionCreateNestedOneWithoutStoresInput
    collections?: CollectionCreateNestedManyWithoutStoreInput
    componentStates?: ComponentStateCreateNestedManyWithoutStoreInput
    dataBindings?: DataBindingCreateNestedManyWithoutStoreInput
    pageCompositions?: PageCompositionCreateNestedManyWithoutStoreInput
    snapshots?: SnapshotCreateNestedManyWithoutStoreInput
    storeStates?: StoreStateCreateNestedManyWithoutStoreInput
  }

  export type StoreUncheckedCreateWithoutDataEntitiesInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    themeId: string
    themeVersionId: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    collections?: CollectionUncheckedCreateNestedManyWithoutStoreInput
    componentStates?: ComponentStateUncheckedCreateNestedManyWithoutStoreInput
    dataBindings?: DataBindingUncheckedCreateNestedManyWithoutStoreInput
    pageCompositions?: PageCompositionUncheckedCreateNestedManyWithoutStoreInput
    snapshots?: SnapshotUncheckedCreateNestedManyWithoutStoreInput
    storeStates?: StoreStateUncheckedCreateNestedManyWithoutStoreInput
  }

  export type StoreCreateOrConnectWithoutDataEntitiesInput = {
    where: StoreWhereUniqueInput
    create: XOR<StoreCreateWithoutDataEntitiesInput, StoreUncheckedCreateWithoutDataEntitiesInput>
  }

  export type StoreUpsertWithoutDataEntitiesInput = {
    update: XOR<StoreUpdateWithoutDataEntitiesInput, StoreUncheckedUpdateWithoutDataEntitiesInput>
    create: XOR<StoreCreateWithoutDataEntitiesInput, StoreUncheckedCreateWithoutDataEntitiesInput>
    where?: StoreWhereInput
  }

  export type StoreUpdateToOneWithWhereWithoutDataEntitiesInput = {
    where?: StoreWhereInput
    data: XOR<StoreUpdateWithoutDataEntitiesInput, StoreUncheckedUpdateWithoutDataEntitiesInput>
  }

  export type StoreUpdateWithoutDataEntitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    theme?: ThemeUpdateOneRequiredWithoutStoresNestedInput
    themeVersion?: ThemeVersionUpdateOneRequiredWithoutStoresNestedInput
    collections?: CollectionUpdateManyWithoutStoreNestedInput
    componentStates?: ComponentStateUpdateManyWithoutStoreNestedInput
    dataBindings?: DataBindingUpdateManyWithoutStoreNestedInput
    pageCompositions?: PageCompositionUpdateManyWithoutStoreNestedInput
    snapshots?: SnapshotUpdateManyWithoutStoreNestedInput
    storeStates?: StoreStateUpdateManyWithoutStoreNestedInput
  }

  export type StoreUncheckedUpdateWithoutDataEntitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    themeVersionId?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collections?: CollectionUncheckedUpdateManyWithoutStoreNestedInput
    componentStates?: ComponentStateUncheckedUpdateManyWithoutStoreNestedInput
    dataBindings?: DataBindingUncheckedUpdateManyWithoutStoreNestedInput
    pageCompositions?: PageCompositionUncheckedUpdateManyWithoutStoreNestedInput
    snapshots?: SnapshotUncheckedUpdateManyWithoutStoreNestedInput
    storeStates?: StoreStateUncheckedUpdateManyWithoutStoreNestedInput
  }

  export type StoreCreateWithoutCollectionsInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    theme: ThemeCreateNestedOneWithoutStoresInput
    themeVersion: ThemeVersionCreateNestedOneWithoutStoresInput
    componentStates?: ComponentStateCreateNestedManyWithoutStoreInput
    dataBindings?: DataBindingCreateNestedManyWithoutStoreInput
    dataEntities?: DataEntityCreateNestedManyWithoutStoreInput
    pageCompositions?: PageCompositionCreateNestedManyWithoutStoreInput
    snapshots?: SnapshotCreateNestedManyWithoutStoreInput
    storeStates?: StoreStateCreateNestedManyWithoutStoreInput
  }

  export type StoreUncheckedCreateWithoutCollectionsInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    themeId: string
    themeVersionId: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    componentStates?: ComponentStateUncheckedCreateNestedManyWithoutStoreInput
    dataBindings?: DataBindingUncheckedCreateNestedManyWithoutStoreInput
    dataEntities?: DataEntityUncheckedCreateNestedManyWithoutStoreInput
    pageCompositions?: PageCompositionUncheckedCreateNestedManyWithoutStoreInput
    snapshots?: SnapshotUncheckedCreateNestedManyWithoutStoreInput
    storeStates?: StoreStateUncheckedCreateNestedManyWithoutStoreInput
  }

  export type StoreCreateOrConnectWithoutCollectionsInput = {
    where: StoreWhereUniqueInput
    create: XOR<StoreCreateWithoutCollectionsInput, StoreUncheckedCreateWithoutCollectionsInput>
  }

  export type CollectionItemCreateWithoutCollectionInput = {
    entityId: string
    sortOrder: number
  }

  export type CollectionItemUncheckedCreateWithoutCollectionInput = {
    entityId: string
    sortOrder: number
  }

  export type CollectionItemCreateOrConnectWithoutCollectionInput = {
    where: CollectionItemWhereUniqueInput
    create: XOR<CollectionItemCreateWithoutCollectionInput, CollectionItemUncheckedCreateWithoutCollectionInput>
  }

  export type CollectionItemCreateManyCollectionInputEnvelope = {
    data: CollectionItemCreateManyCollectionInput | CollectionItemCreateManyCollectionInput[]
  }

  export type StoreUpsertWithoutCollectionsInput = {
    update: XOR<StoreUpdateWithoutCollectionsInput, StoreUncheckedUpdateWithoutCollectionsInput>
    create: XOR<StoreCreateWithoutCollectionsInput, StoreUncheckedCreateWithoutCollectionsInput>
    where?: StoreWhereInput
  }

  export type StoreUpdateToOneWithWhereWithoutCollectionsInput = {
    where?: StoreWhereInput
    data: XOR<StoreUpdateWithoutCollectionsInput, StoreUncheckedUpdateWithoutCollectionsInput>
  }

  export type StoreUpdateWithoutCollectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    theme?: ThemeUpdateOneRequiredWithoutStoresNestedInput
    themeVersion?: ThemeVersionUpdateOneRequiredWithoutStoresNestedInput
    componentStates?: ComponentStateUpdateManyWithoutStoreNestedInput
    dataBindings?: DataBindingUpdateManyWithoutStoreNestedInput
    dataEntities?: DataEntityUpdateManyWithoutStoreNestedInput
    pageCompositions?: PageCompositionUpdateManyWithoutStoreNestedInput
    snapshots?: SnapshotUpdateManyWithoutStoreNestedInput
    storeStates?: StoreStateUpdateManyWithoutStoreNestedInput
  }

  export type StoreUncheckedUpdateWithoutCollectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    themeVersionId?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    componentStates?: ComponentStateUncheckedUpdateManyWithoutStoreNestedInput
    dataBindings?: DataBindingUncheckedUpdateManyWithoutStoreNestedInput
    dataEntities?: DataEntityUncheckedUpdateManyWithoutStoreNestedInput
    pageCompositions?: PageCompositionUncheckedUpdateManyWithoutStoreNestedInput
    snapshots?: SnapshotUncheckedUpdateManyWithoutStoreNestedInput
    storeStates?: StoreStateUncheckedUpdateManyWithoutStoreNestedInput
  }

  export type CollectionItemUpsertWithWhereUniqueWithoutCollectionInput = {
    where: CollectionItemWhereUniqueInput
    update: XOR<CollectionItemUpdateWithoutCollectionInput, CollectionItemUncheckedUpdateWithoutCollectionInput>
    create: XOR<CollectionItemCreateWithoutCollectionInput, CollectionItemUncheckedCreateWithoutCollectionInput>
  }

  export type CollectionItemUpdateWithWhereUniqueWithoutCollectionInput = {
    where: CollectionItemWhereUniqueInput
    data: XOR<CollectionItemUpdateWithoutCollectionInput, CollectionItemUncheckedUpdateWithoutCollectionInput>
  }

  export type CollectionItemUpdateManyWithWhereWithoutCollectionInput = {
    where: CollectionItemScalarWhereInput
    data: XOR<CollectionItemUpdateManyMutationInput, CollectionItemUncheckedUpdateManyWithoutCollectionInput>
  }

  export type CollectionItemScalarWhereInput = {
    AND?: CollectionItemScalarWhereInput | CollectionItemScalarWhereInput[]
    OR?: CollectionItemScalarWhereInput[]
    NOT?: CollectionItemScalarWhereInput | CollectionItemScalarWhereInput[]
    collectionId?: StringFilter<"CollectionItem"> | string
    entityId?: StringFilter<"CollectionItem"> | string
    sortOrder?: IntFilter<"CollectionItem"> | number
  }

  export type CollectionCreateWithoutItemsInput = {
    id?: string
    name: string
    source: string
    rulesJson?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    store: StoreCreateNestedOneWithoutCollectionsInput
  }

  export type CollectionUncheckedCreateWithoutItemsInput = {
    id?: string
    storeId: string
    name: string
    source: string
    rulesJson?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CollectionCreateOrConnectWithoutItemsInput = {
    where: CollectionWhereUniqueInput
    create: XOR<CollectionCreateWithoutItemsInput, CollectionUncheckedCreateWithoutItemsInput>
  }

  export type CollectionUpsertWithoutItemsInput = {
    update: XOR<CollectionUpdateWithoutItemsInput, CollectionUncheckedUpdateWithoutItemsInput>
    create: XOR<CollectionCreateWithoutItemsInput, CollectionUncheckedCreateWithoutItemsInput>
    where?: CollectionWhereInput
  }

  export type CollectionUpdateToOneWithWhereWithoutItemsInput = {
    where?: CollectionWhereInput
    data: XOR<CollectionUpdateWithoutItemsInput, CollectionUncheckedUpdateWithoutItemsInput>
  }

  export type CollectionUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    rulesJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    store?: StoreUpdateOneRequiredWithoutCollectionsNestedInput
  }

  export type CollectionUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    storeId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    rulesJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreCreateWithoutDataBindingsInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    theme: ThemeCreateNestedOneWithoutStoresInput
    themeVersion: ThemeVersionCreateNestedOneWithoutStoresInput
    collections?: CollectionCreateNestedManyWithoutStoreInput
    componentStates?: ComponentStateCreateNestedManyWithoutStoreInput
    dataEntities?: DataEntityCreateNestedManyWithoutStoreInput
    pageCompositions?: PageCompositionCreateNestedManyWithoutStoreInput
    snapshots?: SnapshotCreateNestedManyWithoutStoreInput
    storeStates?: StoreStateCreateNestedManyWithoutStoreInput
  }

  export type StoreUncheckedCreateWithoutDataBindingsInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    themeId: string
    themeVersionId: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    collections?: CollectionUncheckedCreateNestedManyWithoutStoreInput
    componentStates?: ComponentStateUncheckedCreateNestedManyWithoutStoreInput
    dataEntities?: DataEntityUncheckedCreateNestedManyWithoutStoreInput
    pageCompositions?: PageCompositionUncheckedCreateNestedManyWithoutStoreInput
    snapshots?: SnapshotUncheckedCreateNestedManyWithoutStoreInput
    storeStates?: StoreStateUncheckedCreateNestedManyWithoutStoreInput
  }

  export type StoreCreateOrConnectWithoutDataBindingsInput = {
    where: StoreWhereUniqueInput
    create: XOR<StoreCreateWithoutDataBindingsInput, StoreUncheckedCreateWithoutDataBindingsInput>
  }

  export type StoreUpsertWithoutDataBindingsInput = {
    update: XOR<StoreUpdateWithoutDataBindingsInput, StoreUncheckedUpdateWithoutDataBindingsInput>
    create: XOR<StoreCreateWithoutDataBindingsInput, StoreUncheckedCreateWithoutDataBindingsInput>
    where?: StoreWhereInput
  }

  export type StoreUpdateToOneWithWhereWithoutDataBindingsInput = {
    where?: StoreWhereInput
    data: XOR<StoreUpdateWithoutDataBindingsInput, StoreUncheckedUpdateWithoutDataBindingsInput>
  }

  export type StoreUpdateWithoutDataBindingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    theme?: ThemeUpdateOneRequiredWithoutStoresNestedInput
    themeVersion?: ThemeVersionUpdateOneRequiredWithoutStoresNestedInput
    collections?: CollectionUpdateManyWithoutStoreNestedInput
    componentStates?: ComponentStateUpdateManyWithoutStoreNestedInput
    dataEntities?: DataEntityUpdateManyWithoutStoreNestedInput
    pageCompositions?: PageCompositionUpdateManyWithoutStoreNestedInput
    snapshots?: SnapshotUpdateManyWithoutStoreNestedInput
    storeStates?: StoreStateUpdateManyWithoutStoreNestedInput
  }

  export type StoreUncheckedUpdateWithoutDataBindingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    themeVersionId?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collections?: CollectionUncheckedUpdateManyWithoutStoreNestedInput
    componentStates?: ComponentStateUncheckedUpdateManyWithoutStoreNestedInput
    dataEntities?: DataEntityUncheckedUpdateManyWithoutStoreNestedInput
    pageCompositions?: PageCompositionUncheckedUpdateManyWithoutStoreNestedInput
    snapshots?: SnapshotUncheckedUpdateManyWithoutStoreNestedInput
    storeStates?: StoreStateUncheckedUpdateManyWithoutStoreNestedInput
  }

  export type StoreCreateWithoutSnapshotsInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    theme: ThemeCreateNestedOneWithoutStoresInput
    themeVersion: ThemeVersionCreateNestedOneWithoutStoresInput
    collections?: CollectionCreateNestedManyWithoutStoreInput
    componentStates?: ComponentStateCreateNestedManyWithoutStoreInput
    dataBindings?: DataBindingCreateNestedManyWithoutStoreInput
    dataEntities?: DataEntityCreateNestedManyWithoutStoreInput
    pageCompositions?: PageCompositionCreateNestedManyWithoutStoreInput
    storeStates?: StoreStateCreateNestedManyWithoutStoreInput
  }

  export type StoreUncheckedCreateWithoutSnapshotsInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    themeId: string
    themeVersionId: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    collections?: CollectionUncheckedCreateNestedManyWithoutStoreInput
    componentStates?: ComponentStateUncheckedCreateNestedManyWithoutStoreInput
    dataBindings?: DataBindingUncheckedCreateNestedManyWithoutStoreInput
    dataEntities?: DataEntityUncheckedCreateNestedManyWithoutStoreInput
    pageCompositions?: PageCompositionUncheckedCreateNestedManyWithoutStoreInput
    storeStates?: StoreStateUncheckedCreateNestedManyWithoutStoreInput
  }

  export type StoreCreateOrConnectWithoutSnapshotsInput = {
    where: StoreWhereUniqueInput
    create: XOR<StoreCreateWithoutSnapshotsInput, StoreUncheckedCreateWithoutSnapshotsInput>
  }

  export type StoreUpsertWithoutSnapshotsInput = {
    update: XOR<StoreUpdateWithoutSnapshotsInput, StoreUncheckedUpdateWithoutSnapshotsInput>
    create: XOR<StoreCreateWithoutSnapshotsInput, StoreUncheckedCreateWithoutSnapshotsInput>
    where?: StoreWhereInput
  }

  export type StoreUpdateToOneWithWhereWithoutSnapshotsInput = {
    where?: StoreWhereInput
    data: XOR<StoreUpdateWithoutSnapshotsInput, StoreUncheckedUpdateWithoutSnapshotsInput>
  }

  export type StoreUpdateWithoutSnapshotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    theme?: ThemeUpdateOneRequiredWithoutStoresNestedInput
    themeVersion?: ThemeVersionUpdateOneRequiredWithoutStoresNestedInput
    collections?: CollectionUpdateManyWithoutStoreNestedInput
    componentStates?: ComponentStateUpdateManyWithoutStoreNestedInput
    dataBindings?: DataBindingUpdateManyWithoutStoreNestedInput
    dataEntities?: DataEntityUpdateManyWithoutStoreNestedInput
    pageCompositions?: PageCompositionUpdateManyWithoutStoreNestedInput
    storeStates?: StoreStateUpdateManyWithoutStoreNestedInput
  }

  export type StoreUncheckedUpdateWithoutSnapshotsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    themeVersionId?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collections?: CollectionUncheckedUpdateManyWithoutStoreNestedInput
    componentStates?: ComponentStateUncheckedUpdateManyWithoutStoreNestedInput
    dataBindings?: DataBindingUncheckedUpdateManyWithoutStoreNestedInput
    dataEntities?: DataEntityUncheckedUpdateManyWithoutStoreNestedInput
    pageCompositions?: PageCompositionUncheckedUpdateManyWithoutStoreNestedInput
    storeStates?: StoreStateUncheckedUpdateManyWithoutStoreNestedInput
  }

  export type StoreStateCreateManyThemeInput = {
    storeId: string
    themeVersionId: string
    activePage?: string
    viewport?: string
    settingsJson: string
    updatedAt?: Date | string
  }

  export type ThemeVersionCreateManyThemeInput = {
    id?: string
    version: string
    fsPath: string
    contractJson: string
    capabilitiesJson?: string | null
    schemaHash?: string | null
    createdAt?: Date | string
  }

  export type StoreCreateManyThemeInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    themeVersionId: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StoreStateUpdateWithoutThemeInput = {
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    themeVersion?: ThemeVersionUpdateOneRequiredWithoutStoreStatesNestedInput
    store?: StoreUpdateOneRequiredWithoutStoreStatesNestedInput
  }

  export type StoreStateUncheckedUpdateWithoutThemeInput = {
    storeId?: StringFieldUpdateOperationsInput | string
    themeVersionId?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreStateUncheckedUpdateManyWithoutThemeInput = {
    storeId?: StringFieldUpdateOperationsInput | string
    themeVersionId?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThemeVersionUpdateWithoutThemeInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    fsPath?: StringFieldUpdateOperationsInput | string
    contractJson?: StringFieldUpdateOperationsInput | string
    capabilitiesJson?: NullableStringFieldUpdateOperationsInput | string | null
    schemaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeStates?: StoreStateUpdateManyWithoutThemeVersionNestedInput
    stores?: StoreUpdateManyWithoutThemeVersionNestedInput
  }

  export type ThemeVersionUncheckedUpdateWithoutThemeInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    fsPath?: StringFieldUpdateOperationsInput | string
    contractJson?: StringFieldUpdateOperationsInput | string
    capabilitiesJson?: NullableStringFieldUpdateOperationsInput | string | null
    schemaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    storeStates?: StoreStateUncheckedUpdateManyWithoutThemeVersionNestedInput
    stores?: StoreUncheckedUpdateManyWithoutThemeVersionNestedInput
  }

  export type ThemeVersionUncheckedUpdateManyWithoutThemeInput = {
    id?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    fsPath?: StringFieldUpdateOperationsInput | string
    contractJson?: StringFieldUpdateOperationsInput | string
    capabilitiesJson?: NullableStringFieldUpdateOperationsInput | string | null
    schemaHash?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreUpdateWithoutThemeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    themeVersion?: ThemeVersionUpdateOneRequiredWithoutStoresNestedInput
    collections?: CollectionUpdateManyWithoutStoreNestedInput
    componentStates?: ComponentStateUpdateManyWithoutStoreNestedInput
    dataBindings?: DataBindingUpdateManyWithoutStoreNestedInput
    dataEntities?: DataEntityUpdateManyWithoutStoreNestedInput
    pageCompositions?: PageCompositionUpdateManyWithoutStoreNestedInput
    snapshots?: SnapshotUpdateManyWithoutStoreNestedInput
    storeStates?: StoreStateUpdateManyWithoutStoreNestedInput
  }

  export type StoreUncheckedUpdateWithoutThemeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    themeVersionId?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collections?: CollectionUncheckedUpdateManyWithoutStoreNestedInput
    componentStates?: ComponentStateUncheckedUpdateManyWithoutStoreNestedInput
    dataBindings?: DataBindingUncheckedUpdateManyWithoutStoreNestedInput
    dataEntities?: DataEntityUncheckedUpdateManyWithoutStoreNestedInput
    pageCompositions?: PageCompositionUncheckedUpdateManyWithoutStoreNestedInput
    snapshots?: SnapshotUncheckedUpdateManyWithoutStoreNestedInput
    storeStates?: StoreStateUncheckedUpdateManyWithoutStoreNestedInput
  }

  export type StoreUncheckedUpdateManyWithoutThemeInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    themeVersionId?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreStateCreateManyThemeVersionInput = {
    storeId: string
    themeId: string
    activePage?: string
    viewport?: string
    settingsJson: string
    updatedAt?: Date | string
  }

  export type StoreCreateManyThemeVersionInput = {
    id?: string
    title: string
    defaultLocale?: string
    defaultCurrency?: string
    themeId: string
    activePage?: string
    viewport?: string
    settingsJson?: string
    themeSettingsJson?: string
    brandingJson?: string | null
    isMaster?: boolean
    parentStoreId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type StoreStateUpdateWithoutThemeVersionInput = {
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    theme?: ThemeUpdateOneRequiredWithoutStoreStatesNestedInput
    store?: StoreUpdateOneRequiredWithoutStoreStatesNestedInput
  }

  export type StoreStateUncheckedUpdateWithoutThemeVersionInput = {
    storeId?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreStateUncheckedUpdateManyWithoutThemeVersionInput = {
    storeId?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreUpdateWithoutThemeVersionInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    theme?: ThemeUpdateOneRequiredWithoutStoresNestedInput
    collections?: CollectionUpdateManyWithoutStoreNestedInput
    componentStates?: ComponentStateUpdateManyWithoutStoreNestedInput
    dataBindings?: DataBindingUpdateManyWithoutStoreNestedInput
    dataEntities?: DataEntityUpdateManyWithoutStoreNestedInput
    pageCompositions?: PageCompositionUpdateManyWithoutStoreNestedInput
    snapshots?: SnapshotUpdateManyWithoutStoreNestedInput
    storeStates?: StoreStateUpdateManyWithoutStoreNestedInput
  }

  export type StoreUncheckedUpdateWithoutThemeVersionInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collections?: CollectionUncheckedUpdateManyWithoutStoreNestedInput
    componentStates?: ComponentStateUncheckedUpdateManyWithoutStoreNestedInput
    dataBindings?: DataBindingUncheckedUpdateManyWithoutStoreNestedInput
    dataEntities?: DataEntityUncheckedUpdateManyWithoutStoreNestedInput
    pageCompositions?: PageCompositionUncheckedUpdateManyWithoutStoreNestedInput
    snapshots?: SnapshotUncheckedUpdateManyWithoutStoreNestedInput
    storeStates?: StoreStateUncheckedUpdateManyWithoutStoreNestedInput
  }

  export type StoreUncheckedUpdateManyWithoutThemeVersionInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    defaultLocale?: StringFieldUpdateOperationsInput | string
    defaultCurrency?: StringFieldUpdateOperationsInput | string
    themeId?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    themeSettingsJson?: StringFieldUpdateOperationsInput | string
    brandingJson?: NullableStringFieldUpdateOperationsInput | string | null
    isMaster?: BoolFieldUpdateOperationsInput | boolean
    parentStoreId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollectionCreateManyStoreInput = {
    id?: string
    name: string
    source: string
    rulesJson?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ComponentStateCreateManyStoreInput = {
    id?: string
    componentPath: string
    componentKey?: string | null
    instanceOrder: number
    settingsJson: string
    visibilityJson?: string | null
    updatedAt?: Date | string
  }

  export type DataBindingCreateManyStoreInput = {
    id?: string
    componentPath: string
    bindingKey: string
    sourceType: string
    sourceRef: string
    bindingJson?: string | null
    updatedAt?: Date | string
  }

  export type DataEntityCreateManyStoreInput = {
    id?: string
    entityType: string
    entityKey?: string | null
    payloadJson: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PageCompositionCreateManyStoreInput = {
    id?: string
    page: string
    compositionJson: string
    updatedAt?: Date | string
  }

  export type SnapshotCreateManyStoreInput = {
    id?: string
    label: string
    snapshotJson: string
    createdAt?: Date | string
  }

  export type StoreStateCreateManyStoreInput = {
    themeId: string
    themeVersionId: string
    activePage?: string
    viewport?: string
    settingsJson: string
    updatedAt?: Date | string
  }

  export type CollectionUpdateWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    rulesJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: CollectionItemUpdateManyWithoutCollectionNestedInput
  }

  export type CollectionUncheckedUpdateWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    rulesJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: CollectionItemUncheckedUpdateManyWithoutCollectionNestedInput
  }

  export type CollectionUncheckedUpdateManyWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    rulesJson?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ComponentStateUpdateWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    componentPath?: StringFieldUpdateOperationsInput | string
    componentKey?: NullableStringFieldUpdateOperationsInput | string | null
    instanceOrder?: IntFieldUpdateOperationsInput | number
    settingsJson?: StringFieldUpdateOperationsInput | string
    visibilityJson?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ComponentStateUncheckedUpdateWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    componentPath?: StringFieldUpdateOperationsInput | string
    componentKey?: NullableStringFieldUpdateOperationsInput | string | null
    instanceOrder?: IntFieldUpdateOperationsInput | number
    settingsJson?: StringFieldUpdateOperationsInput | string
    visibilityJson?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ComponentStateUncheckedUpdateManyWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    componentPath?: StringFieldUpdateOperationsInput | string
    componentKey?: NullableStringFieldUpdateOperationsInput | string | null
    instanceOrder?: IntFieldUpdateOperationsInput | number
    settingsJson?: StringFieldUpdateOperationsInput | string
    visibilityJson?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataBindingUpdateWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    componentPath?: StringFieldUpdateOperationsInput | string
    bindingKey?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceRef?: StringFieldUpdateOperationsInput | string
    bindingJson?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataBindingUncheckedUpdateWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    componentPath?: StringFieldUpdateOperationsInput | string
    bindingKey?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceRef?: StringFieldUpdateOperationsInput | string
    bindingJson?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataBindingUncheckedUpdateManyWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    componentPath?: StringFieldUpdateOperationsInput | string
    bindingKey?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceRef?: StringFieldUpdateOperationsInput | string
    bindingJson?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataEntityUpdateWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityKey?: NullableStringFieldUpdateOperationsInput | string | null
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataEntityUncheckedUpdateWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityKey?: NullableStringFieldUpdateOperationsInput | string | null
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DataEntityUncheckedUpdateManyWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityKey?: NullableStringFieldUpdateOperationsInput | string | null
    payloadJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PageCompositionUpdateWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    page?: StringFieldUpdateOperationsInput | string
    compositionJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PageCompositionUncheckedUpdateWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    page?: StringFieldUpdateOperationsInput | string
    compositionJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PageCompositionUncheckedUpdateManyWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    page?: StringFieldUpdateOperationsInput | string
    compositionJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapshotUpdateWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapshotUncheckedUpdateWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnapshotUncheckedUpdateManyWithoutStoreInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    snapshotJson?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreStateUpdateWithoutStoreInput = {
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    themeVersion?: ThemeVersionUpdateOneRequiredWithoutStoreStatesNestedInput
    theme?: ThemeUpdateOneRequiredWithoutStoreStatesNestedInput
  }

  export type StoreStateUncheckedUpdateWithoutStoreInput = {
    themeId?: StringFieldUpdateOperationsInput | string
    themeVersionId?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoreStateUncheckedUpdateManyWithoutStoreInput = {
    themeId?: StringFieldUpdateOperationsInput | string
    themeVersionId?: StringFieldUpdateOperationsInput | string
    activePage?: StringFieldUpdateOperationsInput | string
    viewport?: StringFieldUpdateOperationsInput | string
    settingsJson?: StringFieldUpdateOperationsInput | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollectionItemCreateManyCollectionInput = {
    entityId: string
    sortOrder: number
  }

  export type CollectionItemUpdateWithoutCollectionInput = {
    entityId?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type CollectionItemUncheckedUpdateWithoutCollectionInput = {
    entityId?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type CollectionItemUncheckedUpdateManyWithoutCollectionInput = {
    entityId?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use ThemeCountOutputTypeDefaultArgs instead
     */
    export type ThemeCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ThemeCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ThemeVersionCountOutputTypeDefaultArgs instead
     */
    export type ThemeVersionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ThemeVersionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StoreCountOutputTypeDefaultArgs instead
     */
    export type StoreCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StoreCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CollectionCountOutputTypeDefaultArgs instead
     */
    export type CollectionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CollectionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ThemeDefaultArgs instead
     */
    export type ThemeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ThemeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ThemeVersionDefaultArgs instead
     */
    export type ThemeVersionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ThemeVersionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StoreDefaultArgs instead
     */
    export type StoreArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StoreDefaultArgs<ExtArgs>
    /**
     * @deprecated Use StoreStateDefaultArgs instead
     */
    export type StoreStateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = StoreStateDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ComponentStateDefaultArgs instead
     */
    export type ComponentStateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ComponentStateDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PageCompositionDefaultArgs instead
     */
    export type PageCompositionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PageCompositionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DataEntityDefaultArgs instead
     */
    export type DataEntityArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DataEntityDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CollectionDefaultArgs instead
     */
    export type CollectionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CollectionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CollectionItemDefaultArgs instead
     */
    export type CollectionItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CollectionItemDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DataBindingDefaultArgs instead
     */
    export type DataBindingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DataBindingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SnapshotDefaultArgs instead
     */
    export type SnapshotArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SnapshotDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}