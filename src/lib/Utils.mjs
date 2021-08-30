export const getsub = (obj, sub="") => sub.split(
    '.'
).reduce(
    (prev, cur) => prev ? prev[cur] : undefined,
    obj
); 