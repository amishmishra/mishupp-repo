<template>
    <div>
        <h4 class="display-1">Teams</h4>

        <v-data-table v-bind:headers="headers" v-bind:items="teams">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.name }}</td>
            </template>
        </v-data-table>
        <v-btn v-on:click="jcTeam('join-team')"
            >Join Team
        </v-btn>
        <v-btn v-on:click="jcTeam('create-team')"
            >Create Team
        </v-btn>
    </div>
</template>

<script>
    const axios = require("axios");

    export default {
        name: "Teams",
        data: function () {
            return {
                headers: [
                    {text: "name", value: "name"},
                ],
                teams: []
            };
        },
        mounted: function () {
            axios.get("/api/teams").then(response => {
                this.teams = response.data.map(team => ({
                    name: team.name
                }));
            });
        },
        methods: {
            jcTeam: function(path) {
                this.$router.push({name: path});
            }
            
        }
    };
</script>

<style scoped></style>
