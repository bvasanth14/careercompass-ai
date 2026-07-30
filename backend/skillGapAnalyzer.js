// =========================================
// CareerCompass-AI
// Skill Gap Analyzer
// =========================================


function analyzeSkillGap(userSkills, selectedRole, jobRoles) {


    const requiredSkills = jobRoles[selectedRole];


    if (!requiredSkills) {

        return {

            success: false,

            message: "Job role not found"

        };

    }



    const currentSkills = [];

    const missingSkills = [];



    requiredSkills.forEach(skill => {


        const found = userSkills.some(
            userSkill =>
                userSkill.toLowerCase() === skill.toLowerCase()
        );



        if(found){

            currentSkills.push(skill);

        }

        else{

            missingSkills.push(skill);

        }


    });



    const matchPercentage =
        Math.round(
            (currentSkills.length / requiredSkills.length) * 100
        );



    return {


        success:true,

        role:selectedRole,


        totalRequiredSkills:
            requiredSkills.length,


        matchedSkills:
            currentSkills.length,


        currentSkills,


        missingSkills,


        skillMatch:
            matchPercentage



    };


}



module.exports = analyzeSkillGap;