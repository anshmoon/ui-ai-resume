import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import { Rating } from "@smastrom/react-rating";

import "@smastrom/react-rating/style.css";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import GlobalApi from "./../../../../../service/GlobalApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
function Skills() {
  const [skillsList, setSkillsList] = useState([]);
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  useEffect(() => {
    if (resumeInfo && resumeInfo.skills && resumeInfo.skills.data.length > 0) {
      setSkillsList(resumeInfo.skills.data);
    }
  }, []);

  const handleChange = (index, name, value) => {
    const newEntries = skillsList.slice();
    newEntries[index]["attributes"][name] = value;
    setSkillsList(newEntries);
  };

  const AddNewSkills = () => {
    let skillDataObject = {
      data: {
        name: "",
        rating: 0,
      },
    };
    GlobalApi.CreateNewSkill(skillDataObject).then(
      (res) => {
        setSkillsList([...skillsList, res.data.data]);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        toast("Facing issue while adding new skill !");
      }
    );
  };
  const RemoveSkills = () => {
    if (skillsList.length > 0) {
      GlobalApi.DeleteNewSkill(skillsList[skillsList.length - 1].id).then(
        (res) => {
          setSkillsList((skillsList) => skillsList.slice(0, -1));
          toast("Skill removed");
          setLoading(false);
        },
        (error) => {
          setLoading(false);
          toast("Facing issue while removing skill !");
        }
      );
    } else {
      toast("Skills section is empty !");
    }
  };
  const updateSkillOnServer = async () => {
    for (let item of skillsList) {
      try {
        await GlobalApi.UpdateNewSkill(item.id, { data: item.attributes });
      } catch (error) {
        toast("Could not save skill with name " + item.attributes.name);
      }
    }
  };
  const onSave = async () => {
    setLoading(true);
    const data = {
      data: {
        skills: skillsList.map((item) => item.id),
      },
    };
    await updateSkillOnServer();

    GlobalApi.UpdateResumeDetail(params?.resumeId, data).then(
      (res) => {
        setLoading(false);
        toast("Details updated !");
      },
      (error) => {
        setLoading(false);
        toast("Facing error while saving details !");
      }
    );
  };

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      skills:{
        data:skillsList
      }
    });
  }, [skillsList]);
  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Skills</h2>
      <p>Add Your top professional key skills</p>

      <div>
        {skillsList?.map(({ id: id, attributes: item }, index) => (
          <div className="flex justify-between mb-2 border rounded-lg p-3 ">
            <div>
              <label className="text-xs">Name</label>
              <Input
                className="w-full"
                defaultValue={item.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
            </div>
            <Rating
              style={{ maxWidth: 120 }}
              value={item.rating}
              onChange={(v) => handleChange(index, "rating", v)}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={AddNewSkills}
            className="text-primary"
          >
            {" "}
            + Add More Skill
          </Button>
          <Button
            variant="outline"
            onClick={RemoveSkills}
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

export default Skills;
