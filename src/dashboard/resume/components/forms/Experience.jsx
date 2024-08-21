import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useContext, useEffect, useState } from 'react'
import RichTextEditor from '../RichTextEditor'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../../service/GlobalApi'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'

const formField={
    title:'',
    companyName:'',
    city:'',
    state:'',
    startDate:'',
    endDate:'',
    workSummery:'',

}
function Experience() {
    const [experinceList,setExperinceList]=useState([]);
    const {resumeInfo,setResumeInfo}=useContext(ResumeInfoContext);
    const params=useParams();
    const [loading,setLoading]=useState(false);

    useEffect(()=>{
        if(resumeInfo && resumeInfo.Experience && resumeInfo.Experience.data.length > 0){
            setExperinceList(resumeInfo.Experience.data);
        }
        
    },[])

    const handleChange=(index,event)=>{
        const newEntries=experinceList.slice();
        const {name,value}=event.target;
        newEntries[index]["attributes"][name]=value;
        setExperinceList(newEntries);
    }

    const AddNewExperience=()=>{
        let experienceDataObject={
            data:{
                title:'',
                companyName:'',
                city:'',
                state:'',
                startDate:'',
                endDate:'',
                workSummery:'',
            }
        };
        GlobalApi.CreateNewExperience(experienceDataObject).then(res=>{
            setExperinceList([...experinceList,res.data.data])
            setLoading(false);
        },(error)=>{
            setLoading(false);
            toast('Facing issue while adding new experience !')
        })
        
    }

    const RemoveExperience = () => {
      if (experinceList.length > 0) {
        GlobalApi.DeleteNewExperience(experinceList[experinceList.length-1].id).then(
          (res) => {
            setExperinceList((experinceList) => experinceList.slice(0, -1));
            toast("Experience removed");
            setLoading(false);
          },
          (error) => {
            setLoading(false);
            toast("Facing issue while removing experience !");
          }
        );
      }
      else{
        toast("Experience section is empty !");
      }
    }

    const handleRichTextEditor=(e,name,index)=>{
        const newEntries=experinceList.slice();
        newEntries[index]["attributes"][name]=e.target.value;
        setExperinceList(newEntries);
    }

    useEffect(()=>{
        setResumeInfo({
            ...resumeInfo,
            Experience:{
                data:experinceList
            }
        });
     
    },[experinceList]);

    const updateExperienceOnServer=async()=>{
        for(let item of experinceList){
            try{
                await GlobalApi.UpdateNewExperience(item.id,{data:item.attributes});
            }
            catch(error){
                toast("Could not save experience with title "+item.attributes.title);
            }
        }
    }

    const onSave=async()=>{
        setLoading(true)
        const data={
            data:{
                Experience:experinceList.map((item)=> item.id)
            }
        }
       await updateExperienceOnServer();

        GlobalApi.UpdateResumeDetail(params?.resumeId,data).then(res=>{
            setLoading(false);
            toast('Details updated !')
        },(error)=>{
            setLoading(false);
            toast('Facing error while saving details !')
        })

    }
  return (
    <div>
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Professional Experience</h2>
        <p>Add Your previous Job experience</p>
        <div>
            {experinceList?.map(({ id: id, attributes: item },index)=>(
                <div key={index}>
                    <div className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
                        <div>
                            <label className='text-xs'>Position Title</label>
                            <Input name="title" 
                            onChange={(event)=>handleChange(index,event)}
                            defaultValue={item?.title}
                            />
                        </div>
                        <div>
                            <label className='text-xs'>Company Name</label>
                            <Input name="companyName" 
                            onChange={(event)=>handleChange(index,event)}
                            defaultValue={item?.companyName} />
                        </div>
                        <div>
                            <label className='text-xs'>City</label>
                            <Input name="city" 
                            onChange={(event)=>handleChange(index,event)} 
                            defaultValue={item?.city}/>
                        </div>
                        <div>
                            <label className='text-xs'>State</label>
                            <Input name="state" 
                            onChange={(event)=>handleChange(index,event)}
                            defaultValue={item?.state}
                             />
                        </div>
                        <div>
                            <label className='text-xs'>Start Date</label>
                            <Input type="date"  
                            name="startDate" 
                            onChange={(event)=>handleChange(index,event)} 
                            defaultValue={item?.startDate}/>
                        </div>
                        <div>
                            <label className='text-xs'>End Date</label>
                            <Input type="date" name="endDate" 
                            onChange={(event)=>handleChange(index,event)} 
                            defaultValue={item?.endDate}
                            />
                        </div>
                        <div className='col-span-2'>
                           {/* Work Summery  */}
                           <RichTextEditor
                           index={index}
                           defaultValue={item?.workSummery}
                           onRichTextEditorChange={(event)=>handleRichTextEditor(event,'workSummery',index)}  />
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div className='flex justify-between'>
            <div className='flex gap-2'>
            <Button variant="outline" onClick={AddNewExperience} className="text-primary"> + Add More Experience</Button>
            <Button variant="outline" onClick={RemoveExperience} className="text-primary"> - Remove</Button>

            </div>
            <Button disabled={loading} onClick={()=>onSave()}>
            {loading?<LoaderCircle className='animate-spin' />:'Save'}    
            </Button>
        </div>
        </div>
    </div>
  )
}

export default Experience