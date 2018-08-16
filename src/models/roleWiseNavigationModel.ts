export class RoleWiseNavigationModel {
    public ModuleId: string;
    public ModuleName: string
    public MenuId: string;
    public MenuName: string;
    public RolePermission: RoleWisePermission[] = [];
}

export class RoleWisePermission {
    public Id: string;
    public ModuleMenuId: string
    public RoleName: string;
    public Permission: boolean;
}


export class RoleWiseUserModuleModel {
    public Id: string;
    public ModuleName: string
    public ModuleIcon: string
    public ModuleURL: string
    public Menus: RoleWiseUserMenuModel[] = [];
}

export class RoleWiseUserMenuModel {
    public Id: string;
    public MenuName: string;
    public MenuIcon: string;
    public MenuURL: string;
    public Visible: boolean;
    public RolePermission: RoleWiseUserPermission[] = [];
}

export class RoleWiseUserPermission {
    public Id: string;
    public ModuleMenuId: string
    public RoleName: string;
    public RoleDisplayName: string;
    public Permission: boolean;
}