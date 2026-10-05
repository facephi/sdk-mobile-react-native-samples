import { SdkFinishStatus } from "@facephi/sdk-core-react-native";
import { SdkDocumentType, SdkScanMode, selphid, SelphidConfiguration, SelphidResult } from "@facephi/sdk-selphid-react-native";
import { drawError } from "./core";

const getSelphidConfiguration = () => {
    let config: SelphidConfiguration = {
      showResultAfterCapture: true,
      showTutorial: false,
      scanMode: SdkScanMode.Search,
      specificData: 'AR|<ALL>',
      documentType: SdkDocumentType.IdCard,
      fullscreen: true,
      resourcesPath: "fphi-selphid-widget-resources-sdk.zip",
      wizardMode: true
    };
    return config;
};

export const startSelphid = async (
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setSelphidResult: React.Dispatch<React.SetStateAction<SelphidResult|null>>,
    setTextColorMessage: React.Dispatch<React.SetStateAction<string>>,
    setShowError: React.Dispatch<React.SetStateAction<boolean>>
) => 
{ 
    try 
    {
      console.log("Starting startSelphid...");
      setSelphidResult(null);
      return await selphid(getSelphidConfiguration())
      .then((result: any) => 
      {
        console.log("SelphidResult", result as SelphidResult)
        setSelphidResult(result);
        processSelphidResult(result, setMessage, setTextColorMessage, setShowError);
      })
      .finally(()=> {
        console.log("End startSelphid...");
      });
    } 
    catch (error) 
    {
      console.log(error);
    }
};

const processSelphidResult = (
    result: SelphidResult,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setTextColorMessage: React.Dispatch<React.SetStateAction<string>>,
    setShowError: React.Dispatch<React.SetStateAction<boolean>>
) => 
{
    switch (result.finishStatus) 
    {
      case SdkFinishStatus.Ok: // OK
          setShowError(false);
          setTextColorMessage('#777777');
        break;

      // Shows the result operation.
      case SdkFinishStatus.Error: // Error
        if (result.errorType) {
            drawError(setMessage, setTextColorMessage, setShowError, result);
        }
        break;
    }
};