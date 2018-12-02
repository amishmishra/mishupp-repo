<template>
    <v-toolbar dark color="primary">
        <v-toolbar-side-icon></v-toolbar-side-icon>

        <router-link v-bind:to="{ name: 'home-page' }">
            <v-toolbar-title class="white--text">
                Rendezvous
            </v-toolbar-title>
        </router-link>

        <v-spacer></v-spacer>

        <v-btn flat v-bind:to="{ name: 'core' }">Core Hours</v-btn>

        <v-btn flat v-bind:to="{ name: 'teams' }">Teams</v-btn>

        <v-menu offset-y>
            <v-btn flat slot="activator">
                <span>Activities</span>
                <v-icon dark>arrow_drop_down</v-icon>
            </v-btn>

            <v-list>
                <v-list-tile v-bind:to="{ name: 'pending_activities' }">
                    <v-list-tile-title>Pending Activities</v-list-tile-title>
                </v-list-tile>

                <v-list-tile v-bind:to="{ name: 'create_activity' }">
                    <v-list-tile-title>Create Activity</v-list-tile-title>
                </v-list-tile>

            </v-list>
        </v-menu>
    </v-toolbar>
</template>
