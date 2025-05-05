export type TWithAdditionalProperty<BaseType, Property extends keyof any, PropertyType> =
    BaseType extends Record<Property, any> ? never : BaseType & Record<Property, PropertyType>;
