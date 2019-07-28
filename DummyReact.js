module.exports = (Component) => {
    let firstRender = true;
    // values returned by useState & useRef & useMemo
    let memoIndex = 0;
    const memoValues = [];
    const memoDeps = [];

    let stateIndex = 0;
    const stateValues = [];

    let refIndex = 0;
    const refValues = [];

    let callbackIndex = 0;
    const callbackValues = [];
    const callbackDeps = [];

    let effectIndex = 0;
    const effectValues = [];
    const effectDeps = [];
    const effectPrevDeps = [];
    const effectCallbacks = [];
    let prevProps;
    function render(props) {
        prevProps = props;
        const output = Component(props);
        memoIndex = stateIndex = refIndex = callbackIndex = 0;
        if(firstRender) {
            effectValues.forEach((cb, index)=> {
                effectCallbacks.push(cb());
                effectPrevDeps.push(effectDeps[index]);
            });
            firstRender = false;
        } else {
            effectValues.forEach((cb, index)=> {
                const deps = effectDeps[index];
                if (!deps || !effectPrevDeps[index] || deps.some((d, i) => d !== effectPrevDeps[index][i])) {
                    effectPrevDeps[index] = effectDeps[index];
                    if (effectCallbacks[index]) effectCallbacks[index]();
                    effectCallbacks[index] = cb();
                }
            });
        }
        effectIndex = 0;
        return output;
    }
    return {
        render,
        useState(initialValue) {
            if(firstRender) stateValues.push(initialValue);
            const index = stateIndex++;
            return [
                stateValues[index],
                (nextState) => {
                    stateValues[index] = nextState;
                    render(prevProps);
                }
            ]
        },
        unmount(){
            console.log('unmount');
            effectCallbacks.filter(Boolean).forEach(cb => cb());
        },
        useRef(initialValue) {
            if(firstRender) refValues.push({current: initialValue});
            return refValues[refIndex++];
        },
        useCallback(cb, deps) {
            const index = callbackIndex++;
            if(firstRender) {
                callbackValues.push(cb);
                callbackDeps.push(deps);
            } else if(deps.some((d, i)=> d !== callbackDeps[index][i])){
                callbackValues[index] = cb;
                callbackDeps[index] = deps;
            }
            return callbackValues[index];
        },
        useMemo(factory, deps) {
            const index = memoIndex++;
            if(firstRender) {
                memoValues.push(factory());
                memoDeps.push(deps);
            } else if(deps.some((d, i)=> d !== memoDeps[index][i])){
                memoValues[index] = factory();
                memoDeps[index] = deps;
            }
            return memoValues[index];
        },
        useEffect(effect, deps) {
            const index = effectIndex++;
            if(firstRender) {
                effectValues.push(effect);
                effectDeps.push(deps);
            } else {
                effectValues[index] = effect;
                effectDeps[index] = deps;
            }
        },
    }
};