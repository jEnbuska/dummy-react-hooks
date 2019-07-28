const DReact = require('./DummyReact');

const Component = ({username}) => {
    const [age, setAge] = instance.useState(20);
    const renderCount = instance.useRef(0);
    renderCount.current++;
    const fancyName = instance.useMemo(() => {
        console.log('memo: name or age changed');
        return `Mr. ${username} - ${age}`
    }, [username, age]);
    instance.useEffect(() => {
        console.log('effect: age was set');
        return () => console.log('effect cb: age was changed')
    }, [age]);
    console.log({
        fancyName,
        age,
        renderCount,
    });
    const incrementAge = instance.useCallback(() => {
        console.log('callback: incrementing age');
        setAge(age+1);
    }, [age]);
    return {
        setAge,
        incrementAge,
    }
};
const instance= DReact(Component);
let output = instance.render({username: 'Bill'});
output = instance.render({username: 'Bill'});
output.setAge(32);
output = instance.render({username: 'Bob'});
output.incrementAge();
instance.unmount();
