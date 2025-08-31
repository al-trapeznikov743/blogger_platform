export const withErrorHandling = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): void => {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const next = args[args.length - 1];

    try {
      return await originalMethod.apply(this, args);
    } catch (err) {
      if (typeof next === 'function') {
        return next(err);
      }
      throw err;
    }
  };
};
