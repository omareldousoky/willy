import { Ability, AbilityBuilder } from "@casl/ability";
import { getCookie } from '../Services/getCookie';

// Defines how to detect object's type
function subjectName(item) {
    if (!item || typeof item === "string") {
        return item
    }
    return item.__type
}
const ability = new Ability([], { subjectName });
const roles = JSON.parse(getCookie('roles'))
function defineRulesFor(auth) {
    const { can, rules } = new AbilityBuilder<Ability>(Ability);
    if (auth.includes("Data-Entry")) {
        can("create", "Customer")
        can("edit", "Customer")
        can("view", "Application")
        can("edit", "Application")
        can("create", "Application")
        can('create','Loan')
    }
    if (auth.includes("Auditor")) {
        can("view", "Application")
        can("review", "Application")
        can("reject", "Application")
        can("unReview", "Application")
        can('issue','Loan')
    }
    if (auth.includes("Sys-admin")) {
        can("view", "Application")
        can('filterByBranch','Application')
        can("create", "CalculationMethod")
        can("test", "CalculationMethod")
        can("create", "LoanProduct")
        can("assignToBranch", "LoanProduct")
        can("create", "LoanUsage")
        can("edit", "LoanUsage")
    }
    if (auth.includes("IT-ops")) {
        can("edit", "Customer")
        can("edit", "NationalId")
        can("view", "Application")
        can("bulkApprove", "Application")
        can('filterByBranch','Application')
    }
    return rules
}
ability.update(defineRulesFor(['Data-Entry','Auditor','Sys-admin','IT-ops']));

export default ability;