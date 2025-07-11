import { useMutation, useQuery } from "@tanstack/react-query";
import { feedbackService } from "../../api/services/feedbackService";

export const useSubmitFeedback = () => {
  return useMutation({  
    mutationFn:(feedback) => feedbackService.submitFeedback(feedback),
  });
};


