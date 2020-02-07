import React, {useEffect} from 'react';
import useFormState from '../../src/hooks/useFormState';

const UseFormStateExample = () => {
	const [setForm, formData, errors] = useFormState(console.log);
	useEffect(() => {
		console.log({formData, errors});
		
	}, [formData, errors]);
	return (
		<form ref={setForm}>
			<input name="test" required type="text"/>
			<input type="checkbox" name="ee" required/>
			<button type="submit" value=""/>
		</form>
	);
}

export default UseFormStateExample;
