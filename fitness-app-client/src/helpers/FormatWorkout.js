export default function getFormattedWorkout(workout, firstName) {
    const divs = [];
    divs.push("Hey " + firstName + ", here is your workout for " + new Date().toLocaleDateString() + "\n");
    divs.push("Please respond to this text with any questions! \n");

    console.log(workout);
    console.log(workout.exercises.length);
    for(let i=0; i<workout.exercises.length; i++){
        console.log(workout.exercises[i]);
        divs.push(workout.exercises[i].name);
        divs.push("Sets: " + workout.exercises[i].sets);
        divs.push("Reps: " + workout.exercises[i].reps);
        if(workout.exercises[i].weight === 0) {
            divs.push("Weight: Bodyweight");
        } else {
            divs.push("Weight" + workout.exercises[i].weight);
        }
        divs.push("\n");
    }

    let formattedWorkout = "";
    let first = true;
    for(let i=0; i<divs.length; i++) {
        if(!first) {
            formattedWorkout = formattedWorkout + "\n";
        }
        first = false;
        formattedWorkout = formattedWorkout + divs[i];
    }

    return formattedWorkout;
}