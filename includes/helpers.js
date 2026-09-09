export const structurize_response = (
    success,
    message = null,
    data = null,
    extras = null
) => {
    const { metadata, ...restData } = data || {};

    return {
        success,
        message: message || (success ? 'Operation Successful' : 'Operation failed'),
        data: restData,

        ...extras,

        metadata: {
            ...data?.metadata,
            timestamp: new Date().toISOString(),
        }
    }
}

// example call
// structurize_response(
//     true,
//     "test",
//     {
//         id: 1,
//         name: "anmol",
//         metadata: {
//             file: "hello.txt",
//         },
//     },
//     {
//         pagination: {
//             page: 1,
//             limit: 10,
//         },
//         auth: {
//             user: 1,
//             test: false,
//         },
//         example: {
//             real: true,
//             fake: false,
//         },
//     }
// );

// example response
// {
//     success: true,
//     message: "test",
//     data: {
//         id: 1,
//         name: "anmol",
//     },
//     pagination: {
//         page: 1,
//         limit: 10,
//     },
//     auth: {
//         user: 1,
//         test: false,
//     },
//     example: {
//         real: true,
//         fake: false,
//     },
//     metadata: {
//         file: "hello.txt",
//         timestamp: "2026-09-08T..."
//     },
// }

