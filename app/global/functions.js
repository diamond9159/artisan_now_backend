function initial(Role) {
    Role.estimatedDocumentCount().then((count, err) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save().then((res, err) => {
                if (!res) {
                    console.log("error", err);
                }
                console.log("added 'user' to roles collection");
            });

            new Role({
                name: "artisan"
            }).save().then((res, err) => {
                if (!res) {
                    console.log("error", err);
                }

                console.log("added 'artisan' to roles collection");
            });

            new Role({
                name: "admin"
            }).save().then((res, err) => {
                if (!res) {
                    console.log("error", err);
                }

                console.log("added 'admin' to roles collection");
            });
        }
    });
}

const g_func = {
    initial,
};
module.exports = g_func;