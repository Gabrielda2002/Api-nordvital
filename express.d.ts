import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        export interface Request {
            user?: JwtPayload & { rol: (string | number )},
            parentFolderId?: number
            departmentUserId?: number
            hasGlobalFolderAccess?: boolean
        }
    }
}

