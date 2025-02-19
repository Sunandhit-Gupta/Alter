



export default function AddTimeline({isDetailsSelected,setDetailsSelection, isQuestionsSelected, setQuestionsSelection, isSettingsSelected, setSettingsSelection}) {

    const detailsClicked = ()=>{
        setDetailsSelection(true);
        setQuestionsSelection(false);
        setSettingsSelection(false);
    }

    const questionsClicked = ()=>{
        setDetailsSelection(true);
        setQuestionsSelection(true);
        setSettingsSelection(false);
    }

    const SettingsClicked = ()=>{
        setDetailsSelection(true);
        setQuestionsSelection(true);
        setSettingsSelection(true);
    }


  return (
    <div className='flex flex-row justify-center '>
        <div className={`cursor-pointer rounded-full hover:bg-blue-400 p-2 ${isDetailsSelected && 'bg-blue-400'} ${isQuestionsSelected && 'rounded-r-none'}`} onClick={detailsClicked}>Details</div>
        <div className={`${isQuestionsSelected && 'bg-blue-400'} w-11`}></div>
        <div className={`cursor-pointer rounded-full hover:bg-blue-400 p-2 ${isQuestionsSelected && 'bg-blue-400 rounded-l-none'} ${isSettingsSelected && 'rounded-r-none'}`} onClick={questionsClicked}>Questions</div>
        <div className={`${isSettingsSelected && 'bg-blue-400'} w-11`}></div>
        <div className={`cursor-pointer rounded-full hover:bg-blue-400 p-2 ${isSettingsSelected && 'bg-blue-400 rounded-l-none'}`} onClick={SettingsClicked}>Settings</div>
    </div>
  )
}
