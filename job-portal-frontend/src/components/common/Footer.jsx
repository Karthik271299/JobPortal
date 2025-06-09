import { Box, Typography, Divider } from "@mui/material";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        py: 1,          
        mt: "auto",
        textAlign: "center",
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.25 }}>
        &copy; {currentYear} JobPortal. All rights reserved.
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "text.secondary",
          fontSize: "0.75rem",   // smaller font size
          gap: 0.4,
          userSelect: "none",
          mb: 0.5,
        }}
      >
        <Typography variant="caption">Made</Typography>
        <Typography variant="caption">by Karthik from Gavs Technologies</Typography>
      </Box>

      <Divider
        variant="middle"
        sx={{
          my: 0.5,         
          mx: "auto",
          width: { xs: 50, sm: 80 },
          borderColor: "grey.300",
        }}
      />

      <Box sx={{ display: "flex", justifyContent: "center", gap: 0.75, mb: 0.5 }}>
        {[...Array(3)].map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 5,       
              height: 5,
              bgcolor: "grey.400",
              borderRadius: "50%",
            }}
          />
        ))}
      </Box>

      <Box
        sx={{
          height: 2,      
          mt: 1,
          bgcolor: "linear-gradient(90deg, #3f51b5, #9c27b0, #3f51b5)",
          opacity: 0.2,
        }}
      />
    </Box>
  );
};

export default Footer;
