import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import { user } from "./../store";
const useStyles = makeStyles((theme) => ({
	item: {
		margin: 0,
		marginRight: 2,
		marginBottom: 2,
	},
}));

const AlertDialog = (props) => {
	const classes = useStyles();
	return (
		<div>
			<Dialog
				open={props.open}
				onClose={props.onClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogTitle id="alert-dialog-title">
					Please do the following in order:
				</DialogTitle>
				<DialogContent>
					<div>
						<Typography variant="body1">
							1. Spotify probably needs to re-authenticate.
						</Typography>

						<Button
							variant="contained"
							color="primary"
							className={classes.item}
							onClick={() => {
								localStorage.setItem("token", "");
								user.log(
									"Spotify token has been cleared. Please hit Ctrl+F5 to hard refresh your webpage.",
									"end"
								);
							}}
							size="small">
							Click here
						</Button>
						<Typography variant="body1">
							then refresh your webpage
						</Typography>
						<br />
						<Typography variant="body1">
							2. If the above button not work, let's reset all
							your data.
						</Typography>
						<Button
							variant="contained"
							color="primary"
							className={classes.item}
							onClick={() => {
								localStorage.clear();
								user.allPlaylists = [];
								user.log(
									"All playlist data has been cleared. Please hit Ctrl+F5 to hard refresh your webpage.",
									"end"
								);
							}}
							size="small">
							Click here
						</Button>
						<Typography variant="body1">
							then refresh your webpage
						</Typography>
						<br />
						<Typography variant="body1">
							3. If those didn't work, contact Brandon.
						</Typography>
						<Button
							variant="contained"
							color="primary"
							className={classes.item}
							href={"mailto:cathcart.brandon@gmail.com"}
							size="small">
							Click here
						</Button>
						<Typography variant="body1">
							but don't refresh your webpage
						</Typography>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AlertDialog;
