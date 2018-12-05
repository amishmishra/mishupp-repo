<template>
   <div>
        <h4 class="display-1">Core Hours</h4>

        <instructions details="Add your core hours below." />

        <v-form>
            <v-container grid-list-md text-xs-center>
            <v-layout row wrap>
            <v-flex xs6>
            <datetime type="datetime" v-model="datetime"></datetime>
            </v-flex>
            <v-flex xs6>
            </v-flex>
            </v-layout>
            </v-container>
            <v-btn v-bind:disabled="false" v-on:click="handleSubmit"
                >Set
            </v-btn>
        </v-form>

        <!-- <div class="text-xs-center">
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
       </div> -->
       <v-data-table v-bind:headers="headers" v-bind:items="coreHours">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.startCoreHours }}</td>
                <td>{{ props.item.endCoreHours }}</td>
            </template>
        </v-data-table>
       <p>{{ currentUser }}</p>
   </div>
</template>

<script>
import Instructions from "../components/Instructions.vue";
import axios from "axios";
import { Datetime } from 'vue-datetime';
// Vue.use(Datetime);

export default {
    name: "CoreHours",
    components: {
        Instructions,
        Datetime
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
            this.coreHours = response.data.map(row =>(  
                {
                startCoreHours: row.start_date_time,
                endCoreHours: row.end_date_time
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
