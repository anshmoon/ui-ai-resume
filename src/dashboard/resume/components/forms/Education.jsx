import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { LoaderCircle } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GlobalApi from "./../../../../../service/GlobalApi";
import { toast } from "sonner";

function Education() {
  const [loading, setLoading] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();
  const [educationalList, setEducationalList] = useState([]);

  useEffect(() => {
    if (
      resumeInfo &&
      resumeInfo.education &&
      resumeInfo.education.data.length > 0
    ) {
      setEducationalList(resumeInfo.education.data);
    }
  }, []);

  const handleChange = (event, index) => {
    const newEntries = educationalList.slice();
    const { name, value } = event.target;
    newEntries[index]["attributes"][name] = value;
    setEducationalList(newEntries);
  };

  const AddNewEducation = () => {
    let educationDataObject = {
      data: {
        universityName: "",
        degree: "",
        major: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    };
    GlobalApi.CreateNewEducation(educationDataObject).then(
      (res) => {
        setEducationalList([...educationalList, res.data.data]);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        toast("Facing issue while adding new education info !");
      }
    );
  };
  const RemoveEducation = () => {
    if (educationalList.length > 0) {
      GlobalApi.DeleteNewEducation(educationalList[educationalList.length-1].id).then(
        (res) => {
          setEducationalList((educationalList) => educationalList.slice(0, -1));
          toast("Education removed");
          setLoading(false);
        },
        (error) => {
          setLoading(false);
          toast("Facing issue while removing experience !");
        }
      );
    }
    else{
      toast("Education section is empty !");
    }
  };

  const updateEducationOnServer=async()=>{
    for(let item of educationalList){
        try{
            await GlobalApi.UpdateNewEducation(item.id,{data:item.attributes});
        }
        catch(error){
            toast("Could not save education with university name "+item.attributes.universityName);
        }
    }
}

  const onSave = async() => {
    setLoading(true)
    const data={
        data:{
            education:educationalList.map((item)=> item.id)
        }
    }
   await updateEducationOnServer();

    GlobalApi.UpdateResumeDetail(params?.resumeId,data).then(res=>{
        setLoading(false);
        toast('Details updated !')
    },(error)=>{
        setLoading(false);
        toast('Facing error while saving details !')
    })
  };

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      education: {
        data: educationalList,
      },
    });
  }, [educationalList]);
  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Education</h2>
      <p>Add Your educational details</p>

      <div>
        {educationalList?.map(({ id: id, attributes: item }, index) => (
          <div>
            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
              <div className="col-span-2">
                <label>University Name</label>
                <Input
                  name="universityName"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.universityName}
                />
              </div>
              <div>
                <label>Degree</label>
                <Input
                  name="degree"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.degree}
                />
              </div>
              <div>
                <label>Major</label>
                <Input
                  name="major"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.major}
                />
              </div>
              <div>
                <label>Start Date</label>
                <Input
                  type="date"
                  name="startDate"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.startDate}
                />
              </div>
              <div>
                <label>End Date</label>
                <Input
                  type="date"
                  name="endDate"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.endDate}
                />
              </div>
              <div className="col-span-2">
                <label>Description</label>
                <Textarea
                  name="description"
                  onChange={(e) => handleChange(e, index)}
                  defaultValue={item?.description}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={AddNewEducation}
            className="text-primary"
          >
            {" "}
            + Add More Education
          </Button>
          <Button
            variant="outline"
            onClick={RemoveEducation}
            className="text-primary"
          >
            {" "}
            - Remove
          </Button>
        </div>
        <Button disabled={loading} onClick={() => onSave()}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default Education;
