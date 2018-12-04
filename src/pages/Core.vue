<template>
   <div>
        <h4 class="display-1">Core Hours</h4>

        <instructions details="Add your core hours below." />

        <v-form v-model="valid">
            <v-text-field
                v-model="email"
                error-count="10"
                type="email"
                label="Your email address"
            >
            </v-text-field>
            <v-btn v-bind:disabled="!valid" v-on:click="handleSubmit"
                >Set
            </v-btn>
        </v-form>

        <div class="text-xs-center">
            <v-dialog v-model="dialogVisible" width="500">
                <v-card>
                    <v-card-title class="headline grey lighten-2" primary-title>
                        {{ dialogHeader }}
                    </v-card-title>

                    <v-card-text> {{ dialogText }} </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" flat v-on:click="hideDialog"
                            >Okay</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-dialog>
       </div>
       <v-data-table v-bind:headers="headers" v-bind:items="core_hours">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.coreHours }}</td>
            </template>
        </v-data-table>
       <p>{{ currentUser }}</p>
   </div>
</template>

<script>
import Instructions from "../components/Instructions.vue";
import axios from "axios";
export default {
    name: "CoreHours",
    components: {
        Instructions
    },
    data: function() {
        return {
            headers: [
                {text: "Start core hours", value: "startCoreHours"},
                {text: "End core hours", value: "endCoreHours"}
            ],
            coreHours: []           
        };
    },
    mounted: function () {
        axios.get("/api/core_hours", {
            params: {
                email: this.$root.currentUser
            }
        }).then(response => {
            this.core_hours = response.data.map(core_hours => ({
                coreHours: core_hours
            }));
        });
    },
    methods: {
        handleSubmit: function() {
            axios
                .get("/api/core_hours", {
                    email: this.$root.currentUser
                })
                .then(result => {
                    if (result.status === 200) {
                        if (result.data.ok) {
                            this.$root.currentUser = this.email;
                            this.$router.push({name: "home-page"});
                            //this.showDialog("Success", result.data.msge);
                        } else {
                            this.showDialog("Sorry", result.data.msge);
                        }
                    }
                })
                .catch(err => this.showDialog("Failed", err));
        },
    },
    computed: {
        currentUser: function() {
            if (this.$root.currentUser) {
                return this.$root.currentUser;
            } else {
                return "No one logged in";
            }
        }
   }
};
</script>
