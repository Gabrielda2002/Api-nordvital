"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = authorizeRoles;
console.log("roles autorizados");
function authorizeRoles(roles) {
    return (req, res, next) => {
        var _a;
        console.log("roles autorizados", roles);
        const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.rol;
        console.log("usuario autorizado rol", userRole);
        if (!userRole || !roles.map(String).includes(String(userRole))) {
            return res.status(403).json({ message: "No tienes permiso para acceder a este recurso." });
        }
        next();
    };
}
