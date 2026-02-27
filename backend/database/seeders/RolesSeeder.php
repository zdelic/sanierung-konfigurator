<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $perms = [
            'pricebook.view',
            'pricebook.edit',
            'projects.view',
            'projects.edit',
            'projects.delete',
            'users.manage',
        ];

        foreach ($perms as $p) {
            Permission::findOrCreate($p, 'web'); // <= BITNO: guard
        }

        $admin  = Role::findOrCreate('admin', 'web');
        $editor = Role::findOrCreate('editor', 'web');
        $viewer = Role::findOrCreate('viewer', 'web');

        $admin->syncPermissions($perms);
        $editor->syncPermissions(['pricebook.view', 'projects.view', 'projects.edit']);
        $viewer->syncPermissions(['pricebook.view', 'projects.view']);
    }
}
