export async function createTask (definition) {

}

const task = {
  actions,
  name,
  paths
}

export async function runTask (branches, actions, ctx, input) {
  for (const branch of branches) {
    // @TODO: Support nested arrays for parallel execution
    const action = actions[branch.actionIndex]
    const result = await action(ctx, input)
    Object.assign(input, result)

    for (const path in branch.outputs) {
      if (path in result) {
        const outputBranches = branch.outputs[path]
        await runTask(outputBranches, actions, ctx, input)
      }
    }
  }

  return ctx
}
