<template>
    <div>
        <h4 class="display-1">Teams</h4>
        <instructions details="Click team to see members." />

        <v-data-table v-bind:headers="teamHeaders" v-bind:items="teams">
            <template slot="items" slot-scope="props">
                <td v-on:click="getMembers(props.item.team)">{{ props.item.team }}</td>
            </template>
        </v-data-table>
        <v-btn v-on:click="jcTeam('join-team')"
            >Join Team
        </v-btn>
        <v-btn v-on:click="jcTeam('create-team')"
            >Create Team
        </v-btn>

        <div class="text-xs-center">
            <v-dialog v-model="dialogVisible" width="500">
                <v-card>
                    <v-card-title class="headline grey lighten-2" primary-title>
                        {{ dialogHeader }}
                    </v-card-title>

                    <v-card-text>
                        <v-data-table v-bind:headers="memberHeaders" v-bind:items="members">
                            <template slot="items" slot-scope="props">
                                <td>{{ props.item.member }}</td>
                             </template>
                        </v-data-table>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" flat v-on:click="leave(currentTeam)"
                            >Leave Team</v-btn
                        >
                        <v-btn color="primary" flat v-on:click="hideDialog"
                            >Continue</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>

    </div>
</template>

<script>
    const axios = require("axios");
    import Instructions from "../components/Instructions.vue";

    export default {
        name: "Teams",
        components: {
            Instructions
        },
        data: function () {
            return {
                teamHeaders: [
                    {text: "Current teams", value: "teamName"},
                ],
                
                teams: [],

                memberHeaders: [
                    {text: "Team Members", value: "members"},
                ],
                members: [],
                currentTeam: "",
                dialogHeader: "<no dialogHeader>",
                dialogText: "<no dialogText>",
                dialogVisible: false,
            };
        },
        mounted: function () {
            axios.get("/api/teams", {
                params: {
                    email: this.$root.currentUser,
                    include: 'true'
                }
            })
            .then(response => {
                this.teams = response.data.map(team => ({
                    team: team
                }));
            });
        },
        methods: {
            jcTeam: function(path) {
                this.$router.push({name: path});
            },
            getMembers: function(teamName){
                this.memberHeaders[0].text = teamName,
                this.currentTeam = teamName;
                axios.get("/api/teams", {
                    params: {
                        teamName: teamName
                    }
                })
                .then(response => {
                    this.members = response.data.map(member => ({
                        member: member
                    })
                );
                this.showDialog();
                })
            },
            showDialog: function(header, text) {
                this.dialogHeader = header;
                this.dialogText = text;
                this.dialogVisible = true;
            },
            hideDialog: function() {
                this.dialogVisible = false;
            },
            leave: function(teamName) {
                // console.log(teamName);
                this.hideDialog();
            }
            
        }
        
    };
</script>

<style scoped></style>
